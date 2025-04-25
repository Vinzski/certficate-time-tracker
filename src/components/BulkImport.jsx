"use client";

import { useState } from "react";
import { formatTime, convertToHours } from "../utils/timeUtils";
import "../styles/BulkImport.css";

function BulkImport({ onImport }) {
  const [bulkText, setBulkText] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [customCategory, setCustomCategory] = useState("");
  const [updateHoursCompleted, setUpdateHoursCompleted] = useState(true);
  const [parseError, setParseError] = useState(null);
  const [parsedCourses, setParsedCourses] = useState([]);

  // Handle text change in the textarea
  const handleTextChange = (e) => {
    setBulkText(e.target.value);
    setParseError(null);
  };

  // Parse the bulk text into course entries
  const parseEntries = () => {
    if (!bulkText.trim()) {
      setParseError("Please enter some text to parse");
      return;
    }

    try {
      // Split by new lines
      const lines = bulkText.trim().split("\n");
      const parsedEntries = [];

      for (const line of lines) {
        // Match pattern like "5hrs 38mins - Course Name"
        const regex = /(\d+)hrs\s+(\d+)mins\s*-\s*(.*)/i;
        const match = line.match(regex);

        if (!match) {
          throw new Error(
            `Could not parse line: "${line}". Expected format: "5hrs 38mins - Course Name"`
          );
        }

        const hours = Number.parseInt(match[1], 10);
        const minutes = Number.parseInt(match[2], 10);
        const courseName = match[3].trim();

        // Detect platform from course name if possible
        let detectedCategory = detectPlatform(courseName);

        // If no platform detected or we're using a custom category, use the selected category
        if (!detectedCategory || category !== "Auto-detect") {
          detectedCategory = category === "Custom" ? customCategory : category;
        }

        // Calculate time in decimal hours
        const timeInHours = convertToHours(hours, minutes);

        parsedEntries.push({
          id: Date.now() + Math.random(), // Temporary ID
          name: courseName,
          time: formatTime(hours, minutes),
          timeInHours,
          hours,
          minutes,
          category: detectedCategory,
          updateHoursCompleted,
        });
      }

      setParsedCourses(parsedEntries);
      setParseError(null);
    } catch (error) {
      setParseError(error.message);
      setParsedCourses([]);
    }
  };

  // Add this new function to detect platform from course name
  const detectPlatform = (courseName) => {
    const lowerName = courseName.toLowerCase();

    if (lowerName.includes("simplilearn")) return "Simplilearn";
    if (lowerName.includes("linkedin")) return "LinkedIn";
    if (lowerName.includes("coursera")) return "Coursera";
    if (lowerName.includes("udemy")) return "Udemy";
    if (lowerName.includes("edx")) return "edX";
    if (lowerName.includes("pluralsight")) return "Pluralsight";

    return null; // No platform detected
  };

  // Add this function to allow editing individual course categories
  const updateCourseCategory = (index, newCategory) => {
    const updatedCourses = [...parsedCourses];
    updatedCourses[index] = {
      ...updatedCourses[index],
      category: newCategory,
    };
    setParsedCourses(updatedCourses);
  };

  // Import the parsed courses
  const handleImport = () => {
    if (parsedCourses.length === 0) {
      parseEntries();
      return;
    }

    // Generate proper IDs for the courses
    const coursesWithIds = parsedCourses.map((course, index) => ({
      ...course,
      id: Date.now() + index,
    }));

    onImport(coursesWithIds);
    setBulkText("");
    setParsedCourses([]);
  };

  return (
    <div className="bulk-import">
      <h3>Bulk Import Courses</h3>
      <p className="import-instructions">
        Paste your course list in the format:{" "}
        <code>5hrs 38mins - Course Name</code> (one per line)
        <br />
        The system will try to auto-detect platforms from course names, or you
        can set them individually after parsing.
      </p>

      <div className="import-options">
        <div className="category-selector">
          <label htmlFor="category-select">Default Category:</label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
          >
            <option value="Auto-detect">Auto-detect from name</option>
            <option value="Uncategorized">Uncategorized</option>
            <option value="Simplilearn">Simplilearn</option>
            <option value="LinkedIn">LinkedIn</option>
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

        <div className="checkbox-group">
          <input
            id="bulk-update-hours"
            type="checkbox"
            checked={updateHoursCompleted}
            onChange={(e) => setUpdateHoursCompleted(e.target.checked)}
          />
          <label htmlFor="bulk-update-hours">Update Hours Completed</label>
        </div>
      </div>

      <textarea
        value={bulkText}
        onChange={handleTextChange}
        placeholder="5hrs 38mins - Prompt Engineering Application
7hrs 26mins - Blockchain Certification Training
10hrs 41mins - Python for Beginners"
        rows={5}
        className="bulk-textarea"
      ></textarea>

      {parseError && <div className="parse-error">{parseError}</div>}

      {parsedCourses.length > 0 && (
        <div className="parsed-preview">
          <h4>Preview ({parsedCourses.length} courses):</h4>
          <table className="preview-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Duration</th>
                <th>Platform/Category</th>
              </tr>
            </thead>
            <tbody>
              {parsedCourses.map((course, index) => (
                <tr key={index}>
                  <td>{course.name}</td>
                  <td>{course.time}</td>
                  <td>
                    <select
                      value={course.category}
                      onChange={(e) =>
                        updateCourseCategory(index, e.target.value)
                      }
                      className="course-category-select"
                    >
                      <option value="Uncategorized">Uncategorized</option>
                      <option value="Simplilearn">Simplilearn</option>
                      <option value="LinkedIn">LinkedIn</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="import-actions">
        {parsedCourses.length === 0 ? (
          <button onClick={parseEntries} className="btn-secondary">
            Parse Entries
          </button>
        ) : (
          <button onClick={handleImport} className="btn-primary">
            Import {parsedCourses.length} Courses
          </button>
        )}
      </div>
    </div>
  );
}

export default BulkImport;
