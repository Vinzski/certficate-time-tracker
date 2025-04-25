"use client";

import { useState } from "react";
import CourseItem from "./CourseItem";
import BulkImport from "./BulkImport";
import { parseTimeInput, formatTime, convertToHours } from "../utils/timeUtils";
import "../styles/CourseLogger.css";

function CourseLogger({
  onAddCourse,
  courses,
  onDeleteCourse,
  onEditCourse,
  totalTimeSpent,
}) {
  const [courseName, setCourseName] = useState("");
  const [timeSpent, setTimeSpent] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [customCategory, setCustomCategory] = useState("");
  const [updateHoursCompleted, setUpdateHoursCompleted] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  // Get unique categories from courses
  const categories = [
    "All",
    ...new Set(
      courses
        .map((course) => course.category || "Uncategorized")
        .filter(Boolean)
    ),
  ];

  // Filter courses by category
  const filteredCourses =
    filterCategory === "All"
      ? courses
      : courses.filter((course) => course.category === filterCategory);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!courseName.trim() || !timeSpent.trim()) {
      alert("Please enter both course name and time spent");
      return;
    }

    try {
      const parsedTime = parseTimeInput(timeSpent);
      const timeInHours = convertToHours(parsedTime.hours, parsedTime.minutes);

      const finalCategory = category === "Custom" ? customCategory : category;

      if (editMode && currentEditId) {
        // Edit existing course
        onEditCourse({
          id: currentEditId,
          name: courseName,
          time: formatTime(parsedTime.hours, parsedTime.minutes),
          timeInHours,
          hours: parsedTime.hours,
          minutes: parsedTime.minutes,
          category: finalCategory,
          updateHoursCompleted,
        });
        setEditMode(false);
        setCurrentEditId(null);
      } else {
        // Add new course
        onAddCourse({
          id: Date.now(),
          name: courseName,
          time: formatTime(parsedTime.hours, parsedTime.minutes),
          timeInHours,
          hours: parsedTime.hours,
          minutes: parsedTime.minutes,
          category: finalCategory,
          updateHoursCompleted,
        });
      }

      // Reset form
      setCourseName("");
      setTimeSpent("");
      if (category === "Custom") {
        setCategory("Uncategorized");
        setCustomCategory("");
      }
    } catch (error) {
      alert(
        'Invalid time format. Please use formats like "5h 30m", "5.5h", or "330m"'
      );
    }
  };

  // Start editing a course
  const startEdit = (course) => {
    setCourseName(course.name);
    setTimeSpent(course.time);
    setUpdateHoursCompleted(course.updateHoursCompleted);

    if (course.category) {
      if (
        [
          "Uncategorized",
          "Simplilearn",
          "LinkedIn",
          "Coursera",
          "Udemy",
        ].includes(course.category)
      ) {
        setCategory(course.category);
      } else {
        setCategory("Custom");
        setCustomCategory(course.category);
      }
    } else {
      setCategory("Uncategorized");
    }

    setEditMode(true);
    setCurrentEditId(course.id);
  };

  // Cancel editing
  const cancelEdit = () => {
    setCourseName("");
    setTimeSpent("");
    setUpdateHoursCompleted(true);
    setCategory("Uncategorized");
    setCustomCategory("");
    setEditMode(false);
    setCurrentEditId(null);
  };

  // Handle bulk import
  const handleBulkImport = (importedCourses) => {
    // Use a single batch update instead of multiple individual updates
    onAddCourse(importedCourses);
    setShowBulkImport(false);
  };

  return (
    <div className="course-logger">
      <h2>Course Logger</h2>

      <div className="logger-actions">
        <button
          className={`btn-toggle ${!showBulkImport ? "active" : ""}`}
          onClick={() => setShowBulkImport(false)}
        >
          Add Single Course
        </button>
        <button
          className={`btn-toggle ${showBulkImport ? "active" : ""}`}
          onClick={() => setShowBulkImport(true)}
        >
          Bulk Import
        </button>
      </div>

      {showBulkImport ? (
        <BulkImport onImport={handleBulkImport} />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-inputs">
            <div className="input-group">
              <label htmlFor="course-name">Course Name:</label>
              <input
                id="course-name"
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Enter course name"
              />
            </div>

            <div className="input-group">
              <label htmlFor="time-spent">Time Spent:</label>
              <input
                id="time-spent"
                type="text"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                placeholder="e.g., 5h 30m, 5hrs 30mins"
              />
            </div>

            <div className="input-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Uncategorized">Uncategorized</option>
                <option value="Simplilearn">Simplilearn</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Coursera">Coursera</option>
                <option value="Udemy">Udemy</option>
                <option value="Custom">Custom...</option>
              </select>

              {category === "Custom" && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  className="custom-category-input"
                />
              )}
            </div>
          </div>

          <div className="checkbox-group">
            <input
              id="update-hours"
              type="checkbox"
              checked={updateHoursCompleted}
              onChange={(e) => setUpdateHoursCompleted(e.target.checked)}
            />
            <label htmlFor="update-hours">Update Hours Completed</label>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editMode ? "Update Course" : "Add Course"}
            </button>
            {editMode && (
              <button
                type="button"
                className="btn-secondary"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="total-time">
        <p>
          {filterCategory !== "All"
            ? `${filterCategory} Total Time: `
            : "Total Time Spent: "}
          <span>
            {formatTime(
              Math.floor(
                filteredCourses.reduce(
                  (total, course) => total + (course.hours || 0),
                  0
                ) +
                  Math.floor(
                    filteredCourses.reduce(
                      (total, course) => total + (course.minutes || 0),
                      0
                    ) / 60
                  )
              ),
              filteredCourses.reduce(
                (total, course) => total + (course.minutes || 0),
                0
              ) % 60
            )}
          </span>
        </p>
      </div>

      <div className="courses-list">
        <div className="courses-header">
          <h3>Logged Courses</h3>

          <div className="list-controls">
            {courses.length > 0 && (
              <div className="category-filter">
                <label htmlFor="filter-category">Filter by:</label>
                <select
                  id="filter-category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <p className="no-courses">
            {courses.length === 0
              ? "No courses logged yet"
              : "No courses match the selected filter"}
          </p>
        ) : (
          <>
            <div className={viewMode === "grid" ? "courses-grid" : ""}>
              {filteredCourses.map((course) => (
                <CourseItem
                  key={course.id}
                  course={course}
                  onDelete={onDeleteCourse}
                  onEdit={startEdit}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CourseLogger;
