// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // 更新為 v6 的 API
import Login from './login';
import Signup from './signup';
import Home from './home';
import DiaryApp from './DiaryApp';
import Dashboard from './dashboard';
import Accounting from './Accounting';
import Todolist from './Todolist';
import ScheduleApp from './ScheduleApp';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/diaryapp" element={<DiaryApp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Accounting" element={<Accounting />} />
          <Route path="/Todolist" element={<Todolist />} />
          <Route path="/ScheduleApp" element={<ScheduleApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
