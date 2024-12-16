import React, { useState } from 'react';
import axios from 'axios';
import './login.css'; // 如果你有樣式，這是樣式檔案

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);  // 開啟 loading 狀態

  // 處理登入
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);  // 啟動 loading 狀態
    setMessage('');    // 清空錯誤訊息

    try {
      // 發送 POST 請求到後端登入 API
      const response = await axios.post('http://localhost:5001/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',  // 確保請求標頭為 JSON 格式
        }
      });

      if (response.status === 200) {
        // 登入成功，儲存 JWT
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', email);
        setMessage('登入成功');
        // 可以在此處重定向到其他頁面，例如 Dashboard
        window.location.href = '/dashboard';  // 假設有一個 Dashboard 頁面
      }
    } catch (error) {
      setMessage(error.response?.data?.message || '登入失敗');
    } finally {
      setLoading(false);  // 停止 loading 狀態
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>登入</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">電子郵件</label>
          <input
            type="email"
            id="email"
            placeholder="電子郵件"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">密碼</label>
          <input
            type="password"
            id="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        <a href="/signup" className="register-link">尚未註冊？請先註冊</a>
      </div>
    </div>
  );
}

export default Login;
