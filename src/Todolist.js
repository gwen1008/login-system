import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Todolist.css";
import { Link } from 'react-router-dom';


function Todolist() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAddItem = () => setIsAddItemOpen(!isAddItemOpen);

  // 點選日期時顯示對應的事項
  const handleDateClick = (info) => {
    const date = info.dateStr;
    setSelectedDate(date);
    const dateTasks = tasks.filter((task) => task.date === date);
    setSelectedDateTasks(dateTasks);
    toggleAddItem(true); // 打開右側欄
  };

  // 新增事項
  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj = { date: selectedDate, task: newTask, id: Math.random() };
      setTasks([...tasks, newTaskObj]);
      setSelectedDateTasks([...selectedDateTasks, newTaskObj]);
      setNewTask("");
    } else {
      alert("請輸入事項內容");
    }
  };

  // 刪除事項
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    setSelectedDateTasks(updatedTasks.filter((task) => task.date === selectedDate));
  };

  return (
    <div className="todolist-app">
      {/* 側邊功能列表 */}
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

      {/* 中間月曆 */}
      <div className="calendar-container" style={{ marginLeft: isSidebarOpen ? '150px' : '0' }}>
        <h1 className="calendar-title">TODO LIST 月曆</h1>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={tasks.map((task) => ({
            title: task.task,
            date: task.date,
          }))}
          dateClick={handleDateClick}
        />
      </div>

      {/* 右側新增或編輯事項 */}
      <div className={`add-task-container ${isAddItemOpen ? "open" : "closed"}`}>
        <button className="toggle-add-task" onClick={toggleAddItem}>
          {isAddItemOpen ? "收起" : "新增/編輯事項"}
        </button>
        {isAddItemOpen && (
          <div className="add-task-form">
            <h3>日期: {selectedDate || "未選擇"}</h3>
            <ul className="task-list">
              {selectedDateTasks.map((task) => (
                <li key={task.id} className="task-item">
                  {task.task}
                  <button
                    className="delete-task-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    刪除
                  </button>
                </li>
              ))}
            </ul>
            <textarea
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="輸入待辦事項內容"
              className="task-textarea"
            ></textarea>
            <button onClick={addTask} className="add-task-button">
              新增
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Todolist;
