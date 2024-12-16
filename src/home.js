import React from 'react';
import { Link } from 'react-router-dom';
import './home.css'; // 確保你有對應的樣式文件

function Home() {
  return (
    <div className="home">

      <header className="home-header">
      <img src={`${process.env.PUBLIC_URL}/images/image.png`} alt="Header" className="header-image" />
        <h1 className="home-title">UniSync學習管理系統</h1>
        <p className="home-description">
          隨心所欲，簡單高效地管理你的學習與日常！登入以檢視您的課程，或者立即註冊體驗完整功能。
        </p>
      </header>
      <div className="home-buttons">
        <Link to="/login">
          <button className="home-button login-button">登入</button>
        </Link>
        <Link to="/signup">
          <button className="home-button signup-button">註冊</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
