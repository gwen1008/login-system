const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5002;

app.use(bodyParser.json());

// 資料庫連線
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'GWENWU', // 替換為你的資料庫密碼
  database: 'user_auth', // 替換為你的資料庫名稱
});

db.connect((err) => {
  if (err) {
    console.error('無法連線到資料庫:', err);
    process.exit(1);
  }
  console.log('已連線到資料庫');
});

// 啟用 CORS
app.use(cors({
  origin: 'http://localhost:3000', // 允許來自 http://localhost:3000 的請求
  methods: ['GET', 'POST','PUT','DELETE'], // 允許的方法
  allowedHeaders: ['Content-Type'], // 允許的標頭
}));

// 初始化使用者資料表
const initUserTable = (email, callback) => {
  const tableName = `diaries_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS \`${tableName}\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      date DATE NOT NULL,
      weekday VARCHAR(10) NOT NULL,
      content TEXT NOT NULL
    )
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('創建使用者日記資料表失敗:', err);
      callback(err);
    } else {
      callback(null, tableName);
    }
  });
};

app.post('/api/initialize-user', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email 是必填的' });
  }

  initUserTable(email, (err) => {
    if (err) {
      console.error('初始化資料表失敗:', err);
      return res.status(500).json({ message: '初始化資料表失敗' });
    }

    res.status(200).json({ message: '資料表初始化成功' });
  });
});

// 檢查或創建使用者
const ensureUserExists = (email, callback) => {
  const getUserQuery = 'SELECT id FROM users WHERE email = ?';
  const insertUserQuery = 'INSERT INTO users (email) VALUES (?)';

  db.query(getUserQuery, [email], (err, results) => {
    if (err) {
      console.error('查詢使用者失敗:', err);
      callback(err);
    } else if (results.length === 0) {
      db.query(insertUserQuery, [email], (err, insertResults) => {
        if (err) {
          console.error('新增使用者失敗:', err);
          callback(err);
        } else {
          initUserTable(email, callback);
        }
      });
    } else {
      initUserTable(email, callback);
    }
  });
};

// 查詢日記
app.get('/api/diaries', (req, res) => {
  const { email, year, month } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email 是必填的' });
  }

  const tableName = `diaries_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
  let diaryQuery = `SELECT * FROM \`${tableName}\``;
  const params = [];

  if (year || month) {
    diaryQuery += ' WHERE';
    if (year) {
      diaryQuery += ' YEAR(date) = ?';
      params.push(year);
    }
    if (month) {
      if (year) diaryQuery += ' AND';
      diaryQuery += ' MONTH(date) = ?';
      params.push(month);
    }
  }

  db.query(diaryQuery, params, (err, results) => {
    if (err) {
      console.error('查詢日記失敗:', err);
      return res.status(500).json({ message: '查詢日記失敗' });
    }
    res.json(results);
  });
});

// 新增日記
app.post('/api/diaries', (req, res) => {
  const { email, date, content } = req.body;

  if (!email || !date || !content) {
    return res.status(400).json({ message: 'Email、日期和內容是必填的' });
  }

  const weekday = new Date(date).toLocaleDateString('zh-TW', { weekday: 'long' });
  const tableName = `diaries_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const insertDiaryQuery = `INSERT INTO \`${tableName}\` (date, weekday, content) VALUES (?, ?, ?)`;

  ensureUserExists(email, (err) => {
    if (err) {
      return res.status(500).json({ message: '初始化使用者資料失敗' });
    }

    db.query(insertDiaryQuery, [date, weekday, content], (err, results) => {
      if (err) {
        console.error('新增日記失敗:', err);
        return res.status(500).json({ message: '新增日記失敗' });
      }
      res.status(201).json({ id: results.insertId, date, weekday, content });
    });
  });
});

app.put('/api/diaries/:id', (req, res) => {
  const diaryId = req.params.id; // 日記 ID
  const { email, content } = req.body;

  if (!email || !content) {
    return res.status(400).json({ message: 'Email 和內容是必填的' });
  }

  const tableName = `diaries_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const updateDiaryQuery = `
    UPDATE \`${tableName}\` 
    SET content = ? 
    WHERE id = ?
  `;

  ensureUserExists(email, (err) => {
    if (err) {
      return res.status(500).json({ message: '初始化使用者資料失敗' });
    }

    db.query(updateDiaryQuery, [content, diaryId], (err, results) => {
      if (err) {
        console.error('更新日記失敗:', err);
        return res.status(500).json({ message: '更新日記失敗' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: '日記不存在或無法更新' });
      }

      res.json({ message: '日記更新成功' });
    });
  });
});

app.delete('/api/diaries/:id', (req, res) => {
  const diaryId = req.params.id; // 日記 ID
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email 是必填的' });
  }

  const tableName = `diaries_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const deleteDiaryQuery = `
    DELETE FROM \`${tableName}\` 
    WHERE id = ?
  `;

  ensureUserExists(email, (err) => {
    if (err) {
      return res.status(500).json({ message: '初始化使用者資料失敗' });
    }

    db.query(deleteDiaryQuery, [diaryId], (err, results) => {
      if (err) {
        console.error('刪除日記失敗:', err);
        return res.status(500).json({ message: '刪除日記失敗' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: '日記不存在或無法刪除' });
      }

      res.json({ message: '日記刪除成功' });
    });
  });
});


// 啟動伺服器
app.listen(port, () => {
  console.log(`伺服器運行於 http://localhost:${port}`);
});
