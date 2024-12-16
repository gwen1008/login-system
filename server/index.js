const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

const cors = require('cors');
const helmet = require('helmet');

app.use(cors());
app.use(helmet());


// 使用中間件解析 JSON
app.use(express.json());

// 初始化資料庫連接
const db = mysql.createConnection({
    host: '127.0.0.1',  // 使用 127.0.0.1 確保是 localhost 連接
    user: 'root',       // 根據你的 MySQL 設定
    password: 'GWENWU', // 你的密碼
    database: 'user_auth', // 你的資料庫名稱
});

// 確保資料庫連接成功後才啟動伺服器
db.connect((err) => {
    if (err) {
        console.error('資料庫連接失敗:', err);
        process.exit(1);  // 資料庫連接失敗後終止程式
    } else {
        console.log('資料庫連接成功');
        
        // 啟動伺服器
        app.listen(port, () => {
            console.log(`伺服器運行於 http://localhost:${port}`);
        });
    }
});

// 註冊 API
app.post('/register', async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ message: '請提供所有必要的資料' });
    }

    try {
        // 加密密碼
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO users (email, password, username) VALUES (?, ?, ?)';
        db.query(query, [email, hashedPassword, username], (err, result) => {
            if (err) {
                console.error('資料庫錯誤:', err);
                return res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
            }
            res.status(201).json({ message: '註冊成功', userId: result.insertId });
        });
    } catch (err) {
        console.error('加密錯誤:', err);
        res.status(500).json({ message: '伺服器錯誤，請稍後再試' });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: '請提供電子郵件和密碼' });
    }
  
    // 查詢資料庫，檢查用戶是否存在
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ message: '伺服器錯誤' });
      }
  
      if (result.length === 0) {
        // 若沒有找到該 email，返回 "請先註冊"
        return res.status(404).json({ message: '請先註冊' });
      }
  
      // 檢查密碼是否匹配
      const user = result[0];
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
      if (!isPasswordCorrect) {
        // 若密碼錯誤，返回 "密碼錯誤"
        return res.status(400).json({ message: '密碼錯誤' });
      }
  
      // 若登入成功，返回成功訊息
      res.status(200).json({ message: '登入成功' });
    });
  });
  