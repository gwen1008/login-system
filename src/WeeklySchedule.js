import React from 'react';
import './WeeklySchedule.css'; // 分離的 CSS 樣式

function WeeklySchedule({ scheduleData }) {
  const days = ['週一', '週二', '週三', '週四', '週五'];
  const periods = Array.from({ length: 10 }, (_, i) => i + 1); // 假設10節課

  return (
    <div className="schedule-container">
      <h2 className="schedule-title">{scheduleData.semester} 課表</h2>
      <p className="schedule-info">學期開始日期：{scheduleData.startDate}</p>
      <p className="schedule-info">總週數：{scheduleData.weeks}</p>

      <div className="table-container">
        <div className="schedule-table">
          {/* 表格頭部 */}
          <div className="table-header">
            <div className="header-cell">節次</div>
            {days.map((day) => (
              <div key={day} className="header-cell">{day}</div>
            ))}
          </div>

          {/* 表格內容 */}
          {periods.map((period) => (
            <div key={period} className="table-row">
              <div className="table-cell period-cell">第 {period} 節</div>
              {days.map((day) => (
                <div key={`${day}-${period}`} className="table-cell">
                  {scheduleData.schedule[day]?.[period]?.courseName ? (
                    <>
                      <div className="cell-content-bold">{scheduleData.schedule[day][period].courseName}</div>
                      <div className="cell-content">{scheduleData.schedule[day][period].teacher}</div>
                      <div className="cell-content">{scheduleData.schedule[day][period].location}</div>
                    </>
                  ) : (
                    <div className="empty-cell"></div> // 顯示空白而不是"無課程"
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WeeklySchedule;