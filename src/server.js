const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

// 中間件
app.use(cors());
app.use(bodyParser.json());

// 資料庫連線設置
const db = mysql.createConnection({
    host: '127.0.0.1',  // 資料庫主機
    user: 'root',       // 資料庫使用者
    password: 'GWENWU', // 資料庫密碼
    database: 'user_auth', // 資料庫名稱
});

// 確保連線正常
db.connect((err) => {
    if (err) {
        console.error('無法連接資料庫:', err);
        process.exit();
    }
    console.log('成功連接資料庫');
});

// 註冊路由
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // 檢查必要欄位是否存在
    if (!email || !password) {
        return res.status(400).json({ message: '電子郵件和密碼為必填項' });
    }

    // SQL 查詢：檢查 Email 是否已存在
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            console.error('檢查使用者時發生錯誤:', err);
            return res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: '此電子郵件已被註冊' });
        }

        // 如果 Email 不存在，插入新使用者
        const insertUserQuery = `
            INSERT INTO users (username, email, password, is_active, role, last_login) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertUserQuery, [
            username || '', // 預設空字串
            email,
            password,
            1,              // 預設為啟用
            'user',         // 預設為普通使用者
            null            // `last_login` 設為 null
        ], (err, result) => {
            if (err) {
                console.error('插入使用者時發生錯誤:', err);
                return res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
            }

            // 在這裡確認新使用者已成功插入，並顯示其 ID
            console.log('新使用者已插入，ID:', result.insertId);  // 插入的 ID

            res.status(201).json({ message: '註冊成功' });
        });
    });
});

// 啟動伺服器
app.listen(5000, () => {
    console.log('伺服器運行於 http://localhost:5000');
});
