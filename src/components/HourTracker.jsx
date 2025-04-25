"use client"
import "../styles/HourTracker.css"

function HourTracker({
  totalHours,
  setTotalHours,
  hoursCompleted,
  setHoursCompleted,
  hoursRemaining,
  setHoursRemaining,
}) {
  // Handle total hours change
  const handleTotalHoursChange = (e) => {
    const value = Number.parseFloat(e.target.value) || 0
    setTotalHours(value)
    setHoursRemaining(value - hoursCompleted)
  }

  // Handle hours completed change
  const handleHoursCompletedChange = (e) => {
    const value = Number.parseFloat(e.target.value) || 0
    setHoursCompleted(value)
    setHoursRemaining(totalHours - value)
  }

  // Handle hours remaining change (when directly edited)
  const handleHoursRemainingChange = (e) => {
    const value = Number.parseFloat(e.target.value) || 0
    setHoursRemaining(value)
    setHoursCompleted(totalHours - value)
  }

  // Calculate completion percentage
  const completionPercentage = totalHours > 0 ? Math.round((hoursCompleted / totalHours) * 100) : 0

  return (
    <div className="hour-tracker">
      <h2>Hour Tracking</h2>
      <div className="hour-inputs">
        <div className="input-group">
          <label htmlFor="total-hours">Total Hours Needed:</label>
          <input
            id="total-hours"
            type="number"
            min="0"
            step="0.1"
            value={totalHours}
            onChange={handleTotalHoursChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="hours-completed">Hours Completed:</label>
          <input
            id="hours-completed"
            type="number"
            min="0"
            step="0.1"
            value={hoursCompleted}
            onChange={handleHoursCompletedChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="hours-remaining">Hours Remaining:</label>
          <input
            id="hours-remaining"
            type="number"
            min="0"
            step="0.1"
            value={hoursRemaining}
            onChange={handleHoursRemainingChange}
          />
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${completionPercentage}%` }}></div>
      </div>
      <div className="progress-text">{completionPercentage}% Complete</div>

      <div className="hour-stats">
        <div className="stat-card">
          <div className="stat-value">{totalHours.toFixed(1)}</div>
          <div className="stat-label">Total Hours</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{hoursCompleted.toFixed(1)}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{hoursRemaining.toFixed(1)}</div>
          <div className="stat-label">Remaining</div>
        </div>
      </div>
    </div>
  )
}

export default HourTracker
