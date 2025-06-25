"use client"

import { useState, useEffect } from "react"
import dayjs from "dayjs"

const EventForm = ({ onSubmit, onCancel, selectedDate, previousTitles = [], existingEvents = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: selectedDate || dayjs().format("YYYY-MM-DD"),
    time: "09:00",
    duration: "",
    type: "meeting",
    customType: "",
  })

  const [errors, setErrors] = useState({})
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [timeSuggestions, setTimeSuggestions] = useState([])

  const eventTypes = [
    { value: "birthday", label: "Birthday 🎂" },
    { value: "festival", label: "Festival 🎉" },
    { value: "meeting", label: "Meeting 💼" },
    { value: "important", label: "Important ❗" },
    { value: "others", label: "Others ➕" },
  ]

  // Auto-fill duration for meetings
  useEffect(() => {
    if (formData.type === "meeting" && !formData.duration) {
      setFormData((prev) => ({ ...prev, duration: "1h" }))
    }
  }, [formData.type])

  // Generate time suggestions based on existing events
  useEffect(() => {
    if (formData.date) {
      const dayEvents = existingEvents.filter((event) => event.date === formData.date)
      const busyTimes = dayEvents.map((event) => event.time)

      const allTimes = []
      for (let hour = 8; hour <= 18; hour++) {
        const timeStr = `${hour.toString().padStart(2, "0")}:00`
        if (!busyTimes.includes(timeStr)) {
          allTimes.push(timeStr)
        }
      }
      setTimeSuggestions(allTimes.slice(0, 5))
    }
  }, [formData.date, existingEvents])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    // Show title suggestions
    if (name === "title" && value.length > 0) {
      const filtered = previousTitles.filter((title) => title.toLowerCase().includes(value.toLowerCase())).slice(0, 5)
      setSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else if (name === "title") {
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (suggestion) => {
    setFormData((prev) => ({ ...prev, title: suggestion }))
    setShowSuggestions(false)
  }

  const selectTimeSuggestion = (time) => {
    setFormData((prev) => ({ ...prev, time }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.time) {
      newErrors.time = "Time is required"
    }

    if (formData.type === "others" && !formData.customType.trim()) {
      newErrors.customType = "Please specify the event type"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const eventData = {
      title: formData.title.trim(),
      date: formData.date,
      time: formData.time,
      duration: formData.duration.trim(),
      type: formData.type === "others" ? `others: ${formData.customType.trim()}` : formData.type,
      completed: false,
    }

    onSubmit(eventData)
  }

  return (
    <div className="animate-slideUp">
      <h3 className="text-xl font-bold text-primary-800 mb-4">Add New Event</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title with suggestions */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-medium focus:border-transparent transition-all ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter event title"
            autoComplete="off"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}

          {/* Title suggestions */}
          {showSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-medium max-h-32 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectSuggestion(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-blue-light hover:text-blue-800 transition-colors text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-medium focus:border-transparent transition-all ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        {/* Time with suggestions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-medium focus:border-transparent transition-all ${
              errors.time ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}

          {/* Time suggestions */}
          {timeSuggestions.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-600 mb-1">Suggested available times:</p>
              <div className="flex flex-wrap gap-1">
                {timeSuggestions.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => selectTimeSuggestion(time)}
                    className="px-2 py-1 text-xs bg-mint-green text-gray-700 rounded hover:bg-blue-light hover:text-blue-800 transition-colors"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-medium focus:border-transparent transition-all"
            placeholder="e.g., 1h, 30m, 2h 30m"
          />
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-medium focus:border-transparent transition-all"
          >
            {eventTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Type */}
        {formData.type === "others" && (
          <div className="animate-slideDown">
            <label className="block text-sm font-medium text-gray-700 mb-1">Specify Event Type *</label>
            <input
              type="text"
              name="customType"
              value={formData.customType}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-medium focus:border-transparent transition-all ${
                errors.customType ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="e.g., Doctor Appointment, Gym Session"
            />
            {errors.customType && <p className="text-red-500 text-xs mt-1">{errors.customType}</p>}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-medium text-white py-2 px-4 rounded-lg hover:scale-105 hover:shadow-medium transition-all duration-200 font-medium"
          >
            Add Event
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EventForm
