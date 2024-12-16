const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

// 登入路由（只保留登入功能，不加密密碼）
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // 檢查必要欄位是否存在
    if (!email || !password) {
        return res.status(400).json({ message: '電子郵件和密碼為必填項' });
    }

    // 查找用戶
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            console.error('查詢使用者時發生錯誤:', err);
            return res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
        }

        if (results.length === 0) {
            // 用戶不存在
            return res.status(400).json({ message: '電子郵件或密碼錯誤' });
        }

        const user = results[0];

        // 直接比對明文密碼
        if (password !== user.password) {
            // 密碼錯誤
            return res.status(400).json({ message: '電子郵件或密碼錯誤' });
        }

        // 密碼正確，生成 JWT
        const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
        return res.status(200).json({ message: '登入成功', token });
    });
});

// 啟動伺服器
app.listen(5001, () => {
    console.log('伺服器運行於 http://localhost:5001');
});
