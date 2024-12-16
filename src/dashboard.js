import React from 'react';
import { Link } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard">
      {/* 頁面頂部圖片與網站名稱 */}
      <div className="header">
        <img src={`${process.env.PUBLIC_URL}/images/image.png`} alt="Header" className="header-image" />
        <div className="header-text">
          <div className="header-title">UniSync</div>
          <div className="header-slogan">忙碌不再感焦慮，UniSync讓你更有序</div>
        </div>
      </div>

      {/* 功能長條 */}
      <div className="navbar">
        <Link to="/" className="nav-item logo">
          <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="Logo" className="logo-image" />
        </Link>
        <div className="navbar-content">
          <Link to="/ScheduleApp" className="nav-item">課表管理</Link>
          <Link to="/diaryapp" className="nav-item">日記區域</Link>
          <Link to="/Accounting" className="nav-item">每日記帳</Link>
          <Link to="/Todolist" className="nav-item">代辦事項</Link>
        </div>
        <div className="nav-item dropdown">
          個人
          <div className="dropdown-content">
            <Link to="/">登出</Link>
            <Link to="/change-password">修改密碼</Link>
          </div>
        </div>
      </div>

      {/* 內容區 */}
      <div className="main-content">
        <div className="function-cards">
          <div className="card">
            <div className="card-inner">
              <div className="card-front">
                <span>課表管理</span>
              </div>
              <div className="card-back">
                <Link to="/ScheduleApp" className="card-back-text">
                  管理您的課程表，追踪課程時間。
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-inner">
              <div className="card-front">
                <span>日記區域</span>
              </div>
              <div className="card-back">
                <Link to="/diaryapp" className="card-back-text">
                  記錄您的每日心情與事件。
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-inner">
              <div className="card-front">
                <span>每日記帳</span>
              </div>
              <div className="card-back">
                <Link to="/Accounting" className="card-back-text">
                  記錄您的每日支出與收入。
                </Link>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-inner">
              <div className="card-front">
                <span>代辦事項</span>
              </div>
              <div className="card-back">
                <Link to="/Todolist" className="card-back-text">
                  計劃和管理您的待辦事項。
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
