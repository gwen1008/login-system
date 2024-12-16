import React, { useState, useEffect } from 'react';
import './DiaryApp.css';
import { Link } from 'react-router-dom';

function DiaryApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddDiaryOpen, setIsAddDiaryOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [newDiary, setNewDiary] = useState({ date: '', content: '', weekday: '' });
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [editingDiary, setEditingDiary] = useState(null);

  // 格式化日期函式
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' };
    return new Intl.DateTimeFormat('zh-TW', options).format(date);
  };

  useEffect(() => {
    if (!email) {
      alert('未找到用戶 email，請重新登入');
      return;
    }

    // 初始化日記資料表
    const initializeTable = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/initialize-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) {
          throw new Error('初始化日記資料表失敗');
        }
        const data = await response.json();
        console.log(data.message);
        fetchDiaries();
      } catch (error) {
        console.error('初始化失敗:', error);
        alert('初始化日記資料表失敗，請稍後再試');
      }
    };

    initializeTable();
  }, [email]);

  const fetchDiaries = async () => {
    try {
      const response = await fetch(
        `http://localhost:5002/api/diaries?email=${email}&year=${selectedYear}&month=${selectedMonth}`
      );
      if (!response.ok) {
        throw new Error('查詢日記失敗');
      }
      const data = await response.json();
      
      // 將資料按照日期排序，按最新的日記在前
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));

      setDiaryEntries(sortedData.map((entry) => ({
        ...entry,
        formattedDate: formatDate(entry.date), // 格式化日期
      })));
    } catch (error) {
      console.error('查詢日記失敗:', error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAddDiary = () => {
    setIsAddDiaryOpen(!isAddDiaryOpen);
    setEditingDiary(null);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    const weekday = new Date(date).toLocaleDateString('zh-TW', { weekday: 'long' });
    setNewDiary({ ...newDiary, date, weekday });
  };

  const handleContentChange = (e) => {
    setNewDiary({ ...newDiary, content: e.target.value });
  };

  const addOrUpdateDiary = async () => {
    if (!newDiary.date || !newDiary.content || !email) {
      alert('請填寫完整資料');
      return;
    }

    try {
      if (editingDiary) {
        const response = await fetch(`http://localhost:5002/api/diaries/${editingDiary.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, content: newDiary.content }),
        });
        if (!response.ok) {
          throw new Error('更新日記失敗');
        }
        setDiaryEntries((prev) =>
          prev.map((entry) =>
            entry.id === editingDiary.id
              ? { ...entry, content: newDiary.content }
              : entry
          )
        );
      } else {
        const response = await fetch('http://localhost:5002/api/diaries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newDiary, email }),
        });
        if (!response.ok) {
          throw new Error('新增日記失敗');
        }
        const addedDiary = await response.json();
        setDiaryEntries([...diaryEntries, { ...addedDiary, formattedDate: formatDate(addedDiary.date) }]);
      }
      setNewDiary({ date: '', content: '', weekday: '' });
      setIsAddDiaryOpen(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const deleteDiary = async (id) => {
    const confirmDelete = window.confirm('確定要刪除這條日記嗎？');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5002/api/diaries/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error('刪除日記失敗');
      }
      setDiaryEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const editDiary = (entry) => {
    // 設定正在編輯的日記項目
    setEditingDiary(entry);
  
    // 格式化日期（如果需要格式化日期到 YYYY-MM-DD）
    const formattedDate = entry.date ? new Date(entry.date).toISOString().slice(0, 10) : '';
  
    // 填充右側表單的內容
    setNewDiary({
      date: formattedDate, // 格式化的日期
      content: entry.content, // 填入日記內容
      weekday: entry.weekday, // 填入星期
    });
  
    // 打開右側新增日記區域
    setIsAddDiaryOpen(true);
  };
  

  // 處理登出
  const handleLogout = () => {
    localStorage.removeItem('token');  // 清除 JWT
    window.location.href = '/login';   // 重定向到登入頁面
  };  

  return (
    <div className="diary-app">
      {/* 左側功能列表 */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isSidebarOpen ? '<<' : '>>'}
        </button>
        {isSidebarOpen && (
          <ul className="sidebar-menu">
            <li className="menu-item active">
                <Link to="/dashboard" className="active">Home</Link>
            </li>
            <li className="menu-item active">
                <Link to="/ScheduleApp" className="active">課表管理</Link>
            </li>
            <li className="menu-item active">
              <Link to="/diaryapp" className="active">日記區域</Link>
            </li>
            <li className="menu-item active">
                <Link to="/Accounting" className="active">每日記帳</Link>
            </li>
            <li className="menu-item active">
                <Link to="/Todolist" className="active">代辦事項</Link>
            </li>
          </ul>
        )}
      </div>
      <div className="diary-view" style={{ marginLeft: isSidebarOpen ? '150px' : '0' }}>
          <h2>我的日記</h2>
        <div className="filter-section">
          <select
            className="filter-year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">全部年份</option>
            {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            className="filter-month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">全部月份</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                {`${i + 1} 月`}
              </option>
            ))}
          </select>
        </div>


        <div className="diary-entries">
          <br></br>{diaryEntries.length > 0 ? (
            diaryEntries.map((entry) => (
              <div className="diary-entry" key={entry.id}>
                <div className="entry-content">
                  <h4>{entry.formattedDate}</h4>
                  <p>{entry.content}</p>
                </div>
                <div className="entry-actions">
                  <button className="edit-button" onClick={() => editDiary(entry)}>
                    修改
                  </button>
                  <button className="delete-button" onClick={() => deleteDiary(entry.id)}>
                    刪除
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>目前沒有日記。</p>
          )}
        </div>
      </div>
      <div className={`add-diary ${isAddDiaryOpen ? 'open' : 'closed'}`}>
        <button className="add-diary-button" onClick={toggleAddDiary}>
          {isAddDiaryOpen ? ' 收起' : '新增日記'}
        </button>
        {isAddDiaryOpen && (
          <div className="diary-add-form">
            <h3>{editingDiary ? '修改日記' : '新增日記'}</h3>
            <input
              type="date"
              name="date"
              value={newDiary.date}
              onChange={handleDateChange}
              className="input-date"
              disabled={!!editingDiary}
            />
            
            <textarea
              name="content"
              value={newDiary.content}
              onChange={handleContentChange}
              placeholder="輸入日記內容"
              className="input-content"
            ></textarea>
            <button onClick={addOrUpdateDiary} className="save-button">
              {editingDiary ? '保存' : '儲存'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiaryApp;
