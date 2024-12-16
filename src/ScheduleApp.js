import React, { useState } from 'react';
import './ScheduleApp.css';
import { Link } from 'react-router-dom';

function ScheduleApp() {
  const [schedule, setSchedule] = useState({
    Monday: ['', '', '', '', '', '', ''],
    Tuesday: ['', '', '', '', '', '', ''],
    Wednesday: ['', '', '', '', '', '', ''],
    Thursday: ['', '', '', '', '', '', ''],
    Friday: ['', '', '', '', '', '', ''],
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCells, setSelectedCells] = useState([]);
  const [semester, setSemester] = useState('');
  const [courseName, setCourseName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [classroom, setClassroom] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isFormatEditorOpen, setIsFormatEditorOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState(
    Array.from({ length: 7 }, (_, i) => `第${i + 1}節`)
  );

  // 開啟課程編輯器
  const openEditor = (day, period) => {
    setIsEditorOpen(true);
    const cellIndex = selectedCells.findIndex(
      (cell) => cell.day === day && cell.period === period
    );
    if (cellIndex !== -1) {
      setSelectedCells((prev) =>
        prev.filter((_, index) => index !== cellIndex)
      );
    } else {
      setSelectedCells((prev) => [...prev, { day, period }]);
    }
  };

  // 儲存課程
  const saveCourses = () => {
    if (!courseName || !semester) {
      alert('請輸入課程名稱和學期資訊！');
      return;
    }

    setSchedule((prev) => {
      const updatedSchedule = { ...prev };
      selectedCells.forEach(({ day, period }) => {
        let cellContent = courseName;
        if (teacherName) cellContent += `\n教師: ${teacherName}`;
        if (classroom) cellContent += `\n教室: ${classroom}`;
        updatedSchedule[day][period] = cellContent;
      });
      return updatedSchedule;
    });

    resetEditor();
  };

  // 刪除課程
  const deleteCourses = () => {
    if (window.confirm('確定要刪除這些課程嗎？')) {
      setSchedule((prev) => {
        const updatedSchedule = { ...prev };
        selectedCells.forEach(({ day, period }) => {
          updatedSchedule[day][period] = '';
        });
        return updatedSchedule;
      });
      resetEditor();
    }
  };

  // 刪除時段
  const confirmAndDeleteSlot = (slotIndex) => {
    if (window.confirm('確定要刪除此時段嗎？')) {
      setTimeSlots((prev) => prev.filter((_, index) => index !== slotIndex));
    }
  };

  // 匯出 CSV
  const exportToCSV = () => {
    const csvContent =
      '\uFEFF時間,星期一,星期二,星期三,星期四,星期五\n' +
      timeSlots
        .map((time, period) => {
          const row = [time];
          Object.keys(schedule).forEach((day) => {
            row.push(`"${schedule[day][period] || ''}"`);
          });
          return row.join(',');
        })
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${semester || '課程表'}.csv`;
    link.click();
  };

  // 重設編輯器
  const resetEditor = () => {
    setSelectedCells([]);
    setCourseName('');
    setTeacherName('');
    setClassroom('');
    setIsEditorOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');  // 清除 JWT
    window.location.href = '/login';   // 重定向到登入頁面
  };  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <div className="schedule-app">
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

      {/* 中間課表 */}
      <div className="schedule-view">
        <h2>{semester ? `${semester} 課程表` : '課程表'}</h2>
        <table className="schedule-table">
          <thead>
            <tr>
              <th>時間</th>
              <th>星期一</th>
              <th>星期二</th>
              <th>星期三</th>
              <th>星期四</th>
              <th>星期五</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, period) => (
              <tr key={period}>
                <td>{time}</td>
                {Object.keys(schedule).map((day) => (
                  <td
                    key={day}
                    className={
                      selectedCells.some(
                        (cell) => cell.day === day && cell.period === period
                      )
                        ? 'selected'
                        : ''
                    }
                    onClick={() => openEditor(day, period)}
                  >
                    {schedule[day][period] || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={exportToCSV} className="export-button">
          匯出 CSV
        </button>
      </div>

      {/* 右側編輯器 */}
      <div className={`editor ${isEditorOpen || isFormatEditorOpen ? 'open' : ''}`}>
        {isEditorOpen && (
          <div className="editor-content">
            <h3>編輯課程</h3>
            <input
              type="text"
              placeholder="課程名稱"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <input
              type="text"
              placeholder="教師名稱 (選填)"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
            />
            <input
              type="text"
              placeholder="教室 (選填)"
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
            />
            <button onClick={saveCourses}>儲存課程</button>
            <button onClick={deleteCourses}>刪除課程</button>
            <button onClick={resetEditor}>取消</button>
          </div>
        )}
        {isFormatEditorOpen && (
          <div className="editor-content">
            <h3>格式修改</h3>
            <input
              type="text"
              placeholder="學期資訊"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />
            {timeSlots.map((time, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={`第${index + 1}節時間`}
                  value={time}
                  onChange={(e) => {
                    const newSlots = [...timeSlots];
                    newSlots[index] = e.target.value;
                    setTimeSlots(newSlots);
                  }}
                />
                <button onClick={() => confirmAndDeleteSlot(index)}>刪除</button>
              </div>
            ))}
            <button onClick={() => setTimeSlots([...timeSlots, '新時段'])}>
              新增時段
            </button>
          </div>
        )}
        <button
          className="toggle-format-editor"
          onClick={() => setIsFormatEditorOpen(!isFormatEditorOpen)}
        >
          {isFormatEditorOpen ? '關閉格式編輯' : '修改課表格式'}
        </button>
      </div>
    </div>
  );
}

export default ScheduleApp;
