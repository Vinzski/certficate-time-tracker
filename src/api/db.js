import axios from "axios"

const API_URL = "http://localhost:3001"

// Get time tracker data
export const getTimeTrackerData = async () => {
  try {
    const response = await axios.get(`${API_URL}/timeTrackerData`)
    return response.data
  } catch (error) {
    console.error("Error fetching data:", error)
    return {
      totalHours: 0,
      hoursCompleted: 0,
      hoursRemaining: 0,
      courses: [],
    }
  }
}

// Update time tracker data
export const updateTimeTrackerData = async (data) => {
  try {
    const response = await axios.put(`${API_URL}/timeTrackerData`, data)
    return response.data
  } catch (error) {
    console.error("Error updating data:", error)
    throw error
  }
}
