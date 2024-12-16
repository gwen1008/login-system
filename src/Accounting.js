import React, { useState } from 'react';
import './Accounting.css'; // 引入樣式檔案
import { Link } from 'react-router-dom';

function Accounting() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [date, setDate] = useState('');
  const [type, setType] = useState('支出');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [item, setItem] = useState('');
  const [entries, setEntries] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAddEntry = () => setIsAddEntryOpen(!isAddEntryOpen);

  const handleAddEntry = () => {
    if (!date || !amount || !item || (!category && !customCategory)) {
      alert('請填寫所有欄位');
      return;
    }

    const newEntry = {
      date,
      type,
      category: category === '自訂類別' ? customCategory : category,
      amount: parseFloat(amount),
      item,
    };

    setEntries([...entries, newEntry]);
    setDate('');
    setAmount('');
    setItem('');
    setCategory('');
    setCustomCategory('');
  };
  // 處理登出
  const handleLogout = () => {
      localStorage.removeItem('token');  // 清除 JWT
      window.location.href = '/login';   // 重定向到登入頁面
    };  
  const handleDeleteEntry = (index) => {
    if (window.confirm('確定要刪除這筆記錄嗎？')) {
      const updatedEntries = entries.filter((_, i) => i !== index);
      setEntries(updatedEntries);
    }
  };

  const totalExpense = entries
    .filter((entry) => entry.type === '支出')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalIncome = entries
    .filter((entry) => entry.type === '收入')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const netAmount = totalIncome - totalExpense;

  return (
    <div className="accounting-app">
      {/* 左側功能選單 */}
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

      {/* 中間區域 */}
      <div className="accounting-view"style={{ marginLeft: isSidebarOpen ? '150px' : '0' }}>
          <h2>記帳統計</h2>
        <div className="summary">
            <p>總支出：{Math.abs(totalExpense).toFixed(2)} 元</p>
            <p>總收入：{totalIncome.toFixed(2)} 元</p>
            <p>結算金額：{netAmount.toFixed(2)} 元</p>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>日期</th>
              <th>類型</th>
              <th>類別</th>
              <th>金額</th>
              <th>項目</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.type}</td>
                <td>{entry.category}</td>
                <td>{entry.amount.toFixed(2)} 元</td>
                <td>{entry.item}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteEntry(index)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 右側新增項目區 */}
      <div className={`add-entry ${isAddEntryOpen ? 'open' : 'closed'}`}>
        <button className="add-entry-button" onClick={toggleAddEntry}>
          {isAddEntryOpen ? '收起' : '新增記錄'}
        </button>
        {isAddEntryOpen && (
          <div className="entry-form">
            <h3>新增記錄</h3>
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <select
              className="input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="支出">支出</option>
              <option value="收入">收入</option>
            </select>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">請選擇類別</option>
              <option value="餐飲">餐飲</option>
              <option value="交通">交通</option>
              <option value="娛樂">娛樂</option>
              <option value="購物">購物</option>
              <option value="薪資">薪資</option>
              <option value="自訂類別">自訂類別</option>
            </select>
            {category === '自訂類別' && (
              <input
                className="input"
                type="text"
                placeholder="輸入自訂類別名稱"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            )}
            <input
              className="input"
              type="text"
              placeholder="項目"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
            <input
              className="input"
              type="number"
              placeholder="金額"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="save-button" onClick={handleAddEntry}>
              儲存
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Accounting;
