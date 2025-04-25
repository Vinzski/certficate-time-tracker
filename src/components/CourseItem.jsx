"use client"

import "../styles/CourseItem.css"

function CourseItem({ course, onDelete, onEdit }) {
  return (
    <div className="course-item">
      <div className="course-info">
        <h4>{course.name}</h4>
        <p>
          Duration: <span>{course.time}</span>
        </p>
        {course.category && course.category !== "Uncategorized" && (
          <span className="category-badge">{course.category}</span>
        )}
        {course.updateHoursCompleted && <span className="badge">Counted in Hours Completed</span>}
      </div>
      <div className="course-actions">
        <button className="btn-edit" onClick={() => onEdit(course)} aria-label="Edit course">
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(course.id)} aria-label="Delete course">
          Delete
        </button>
      </div>
    </div>
  )
}

export default CourseItem
