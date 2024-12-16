import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // 引入你的 App 組件
import './index.css';     // 引入 CSS 樣式

const root = ReactDOM.createRoot(document.getElementById('root'));  // 獲取 HTML 元素
root.render(
  <React.StrictMode>  
    <App /> 
  </React.StrictMode>
);
