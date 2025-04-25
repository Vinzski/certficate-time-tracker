// Parse time input in various formats (5h 30m, 5.5h, 330m, etc.)
export function parseTimeInput(input) {
    input = input.toLowerCase().trim()
  
    // Check for format like "5hrs 38mins" or "5h 30m" or "5h30m"
    const hourMinutePattern = /(\d+\.?\d*)\s*h(?:rs?|ours?)?(?:\s*|and\s*)(\d+\.?\d*)\s*m(?:ins?|in(?:ute)?s?)?/
    const hourMinuteMatch = input.match(hourMinutePattern)
  
    if (hourMinuteMatch) {
      return {
        hours: Number.parseFloat(hourMinuteMatch[1]),
        minutes: Number.parseFloat(hourMinuteMatch[2]),
      }
    }
  
    // Check for hours only (5h, 5 hours)
    const hoursOnlyPattern = /(\d+\.?\d*)\s*h(?:rs?|ours?)?$/
    const hoursOnlyMatch = input.match(hoursOnlyPattern)
  
    if (hoursOnlyMatch) {
      return {
        hours: Number.parseFloat(hoursOnlyMatch[1]),
        minutes: 0,
      }
    }
  
    // Check for minutes only (30m, 30 minutes)
    const minutesOnlyPattern = /(\d+\.?\d*)\s*m(?:ins?|in(?:ute)?s?)?$/
    const minutesOnlyMatch = input.match(minutesOnlyPattern)
  
    if (minutesOnlyMatch) {
      const totalMinutes = Number.parseFloat(minutesOnlyMatch[1])
      return {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60,
      }
    }
  
    // Check for decimal hours (5.5)
    const decimalHoursPattern = /^(\d+\.?\d*)$/
    const decimalHoursMatch = input.match(decimalHoursPattern)
  
    if (decimalHoursMatch) {
      const decimalHours = Number.parseFloat(decimalHoursMatch[1])
      return {
        hours: Math.floor(decimalHours),
        minutes: Math.round((decimalHours % 1) * 60),
      }
    }
  
    throw new Error("Invalid time format")
  }
  
  // Format hours and minutes into a readable string
  export function formatTime(hours, minutes) {
    if (hours === 0 && minutes === 0) {
      return "0m"
    }
  
    let result = ""
  
    if (hours > 0) {
      result += `${hours}h`
    }
  
    if (minutes > 0) {
      if (result) result += " "
      result += `${Math.round(minutes)}m`
    }
  
    return result
  }
  
  // Convert hours and minutes to decimal hours
  export function convertToHours(hours, minutes) {
    return hours + minutes / 60
  }
  