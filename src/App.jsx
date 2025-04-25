"use client"

import { useState, useEffect } from "react"
import "./App.css"
import HourTracker from "./components/HourTracker"
import CourseLogger from "./components/CourseLogger"
import { getTimeTrackerData, updateTimeTrackerData } from "./api/db"

function App() {
  const [totalHours, setTotalHours] = useState(0)
  const [hoursCompleted, setHoursCompleted] = useState(0)
  const [hoursRemaining, setHoursRemaining] = useState(0)
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load data from db.json on initial render
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getTimeTrackerData()
        setTotalHours(data.totalHours || 0)
        setHoursCompleted(data.hoursCompleted || 0)
        setHoursRemaining(data.hoursRemaining || 0)
        setCourses(data.courses || [])
        setError(null)
      } catch (err) {
        setError("Failed to load data. Please make sure json-server is running.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Save data to db.json whenever state changes
  useEffect(() => {
    // Skip saving on initial load
    if (isLoading) return

    const saveData = async () => {
      try {
        await updateTimeTrackerData({
          totalHours,
          hoursCompleted,
          hoursRemaining,
          courses,
        })
      } catch (err) {
        setError("Failed to save data. Please make sure json-server is running.")
        console.error(err)
      }
    }

    saveData()
  }, [totalHours, hoursCompleted, hoursRemaining, courses, isLoading])

  // Calculate total time spent across all courses
  const totalTimeSpent = courses.reduce((total, course) => {
    return total + course.timeInHours
  }, 0)

  // Handle adding a new course or multiple courses
  const handleAddCourse = (newCourseData) => {
    // Check if we're adding a single course or multiple courses
    if (Array.isArray(newCourseData)) {
      // Handle multiple courses
      const newCourses = [...courses, ...newCourseData]
      setCourses(newCourses)

      // Calculate total hours to add from all courses that should update hours completed
      const additionalHours = newCourseData.reduce((total, course) => {
        return course.updateHoursCompleted ? total + course.timeInHours : total
      }, 0)

      if (additionalHours > 0) {
        const newHoursCompleted = hoursCompleted + additionalHours
        setHoursCompleted(newHoursCompleted)
        setHoursRemaining(totalHours - newHoursCompleted)
      }
    } else {
      // Handle single course
      setCourses([...courses, newCourseData])

      // Auto-update hours completed if option is enabled
      if (newCourseData.updateHoursCompleted) {
        const newHoursCompleted = hoursCompleted + newCourseData.timeInHours
        setHoursCompleted(newHoursCompleted)
        setHoursRemaining(totalHours - newHoursCompleted)
      }
    }
  }

  // Handle deleting a course
  const handleDeleteCourse = (courseId) => {
    const courseToDelete = courses.find((course) => course.id === courseId)
    const newCourses = courses.filter((course) => course.id !== courseId)
    setCourses(newCourses)

    // Update hours completed if the deleted course was counted
    if (courseToDelete.updateHoursCompleted) {
      const newHoursCompleted = hoursCompleted - courseToDelete.timeInHours
      setHoursCompleted(newHoursCompleted)
      setHoursRemaining(totalHours - newHoursCompleted)
    }
  }

  // Handle editing a course
  const handleEditCourse = (editedCourse) => {
    const originalCourse = courses.find((course) => course.id === editedCourse.id)
    const newCourses = courses.map((course) => (course.id === editedCourse.id ? editedCourse : course))
    setCourses(newCourses)

    // Update hours completed if needed
    if (originalCourse.updateHoursCompleted || editedCourse.updateHoursCompleted) {
      let hoursDifference = 0

      if (originalCourse.updateHoursCompleted && editedCourse.updateHoursCompleted) {
        hoursDifference = editedCourse.timeInHours - originalCourse.timeInHours
      } else if (editedCourse.updateHoursCompleted) {
        hoursDifference = editedCourse.timeInHours
      } else if (originalCourse.updateHoursCompleted) {
        hoursDifference = -originalCourse.timeInHours
      }

      const newHoursCompleted = hoursCompleted + hoursDifference
      setHoursCompleted(newHoursCompleted)
      setHoursRemaining(totalHours - newHoursCompleted)
    }
  }

  if (isLoading) {
    return <div className="loading">Loading data...</div>
  }

  return (
    <div className="app-container">
      <h1>Certificate Time Tracker</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="app-layout">
        <HourTracker
          totalHours={totalHours}
          setTotalHours={setTotalHours}
          hoursCompleted={hoursCompleted}
          setHoursCompleted={setHoursCompleted}
          hoursRemaining={hoursRemaining}
          setHoursRemaining={setHoursRemaining}
        />

        <CourseLogger
          onAddCourse={handleAddCourse}
          courses={courses}
          onDeleteCourse={handleDeleteCourse}
          onEditCourse={handleEditCourse}
          totalTimeSpent={totalTimeSpent}
        />
      </div>
    </div>
  )
}

export default App
