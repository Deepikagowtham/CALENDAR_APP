"use client"

import { useState, useRef } from "react"
import dayjs from "dayjs"
import CalendarHeader from "./CalendarHeader"
import DayCell from "./DayCell"

const Calendar = ({
  events,
  onDateClick,
  onEventUpdate,
  onEventComplete,
  notes,
  images,
  onNoteClick,
  onImageClick,
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [viewMode, setViewMode] = useState("month")
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState("")
  const [draggedEvent, setDraggedEvent] = useState(null)

  const calendarRef = useRef(null)

  const startOfMonth = currentDate.startOf("month")
  const endOfMonth = currentDate.endOf("month")
  const startOfCalendar = startOfMonth.startOf("week")
  const endOfCalendar = endOfMonth.endOf("week")

  const calendarDays = []
  let day = startOfCalendar

  while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar, "day")) {
    calendarDays.push(day)
    day = day.add(1, "day")
  }

  const navigateMonth = (direction) => {
    if (isAnimating) return

    setIsAnimating(true)
    setAnimationDirection(direction > 0 ? "right" : "left")

    setTimeout(() => {
      setCurrentDate((prev) => prev.add(direction, "month"))
      setTimeout(() => {
        setIsAnimating(false)
        setAnimationDirection("")
      }, 300)
    }, 300)
  }

  const goToToday = () => {
    setCurrentDate(dayjs())
  }

  const getEventsForDate = (date) => {
    return events.filter((event) => dayjs(event.date).isSame(date, "day"))
  }

  const handleDragStart = (e, event) => {
    setDraggedEvent(event)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e, targetDate) => {
    e.preventDefault()
    if (draggedEvent) {
      const updatedEvent = {
        ...draggedEvent,
        date: targetDate.format("YYYY-MM-DD"),
      }
      onEventUpdate(draggedEvent.id, updatedEvent)
      setDraggedEvent(null)
    }
  }

  // Helper function to check if a date is a holiday
  const isHoliday = (date) => {
    const dayOfWeek = date.day() // 0 = Sunday, 6 = Saturday

    // Sunday is always a holiday
    if (dayOfWeek === 0) return { type: "sunday", name: "Sunday" }

    // Check for 2nd and 4th Saturday
    if (dayOfWeek === 6) {
      const dateOfMonth = date.date()
      const startOfMonth = date.startOf("month")
      const firstSaturday = startOfMonth.day(6) // Get first Saturday of the month

      // Calculate which Saturday of the month this is
      const saturdayOfMonth = Math.ceil((dateOfMonth - firstSaturday.date() + 1) / 7)

      if (saturdayOfMonth === 2) {
        return { type: "second-saturday", name: "2nd Saturday" }
      }
      if (saturdayOfMonth === 4) {
        return { type: "fourth-saturday", name: "4th Saturday" }
      }
    }

    return null
  }

  if (viewMode === "week") {
    return (
      <div className="bg-white rounded-xl shadow-soft p-6 animate-slideIn">
        <CalendarHeader
          currentDate={currentDate}
          onNavigate={navigateMonth}
          onToday={goToToday}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <WeekView
          currentDate={currentDate}
          events={events}
          onDateClick={onDateClick}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onEventComplete={onEventComplete}
        />
      </div>
    )
  }

  if (viewMode === "day") {
    return (
      <div className="bg-white rounded-xl shadow-soft p-6 animate-slideIn">
        <CalendarHeader
          currentDate={currentDate}
          onNavigate={navigateMonth}
          onToday={goToToday}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <DayView currentDate={currentDate} events={getEventsForDate(currentDate)} onEventComplete={onEventComplete} />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 animate-slideIn">
      <CalendarHeader
        currentDate={currentDate}
        onNavigate={navigateMonth}
        onToday={goToToday}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isAnimating={isAnimating}
      />

      {/* Days of week header with holiday indicators */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={day}
            className={`p-2 text-center font-semibold ${
              index === 0 ? "text-purple-600" : index === 6 ? "text-purple-500" : "text-primary-600"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid with flip animation */}
      <div
        ref={calendarRef}
        className={`grid grid-cols-7 gap-1 transition-all duration-300 ${
          isAnimating ? `animate-flip${animationDirection === "right" ? "Right" : "Left"}` : "animate-fadeIn"
        }`}
      >
        {calendarDays.map((day, index) => (
          <DayCell
            key={`${day.format("YYYY-MM-DD")}-${currentDate.format("YYYY-MM")}`}
            date={day}
            isCurrentMonth={day.isSame(currentDate, "month")}
            isToday={day.isSame(dayjs(), "day")}
            isHoliday={isHoliday(day)}
            events={getEventsForDate(day)}
            note={notes[day.format("YYYY-MM-DD")]}
            image={images[day.format("YYYY-MM-DD")]}
            onClick={() => onDateClick(day.format("YYYY-MM-DD"))}
            onNoteClick={() => onNoteClick(day.format("YYYY-MM-DD"))}
            onImageClick={() => onImageClick(day.format("YYYY-MM-DD"))}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, day)}
            onEventComplete={onEventComplete}
          />
        ))}
      </div>

      {/* Holiday Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
          <span>Sunday</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-purple-200 border border-purple-400 rounded"></div>
          <span>2nd & 4th Saturday</span>
        </div>
      </div>
    </div>
  )
}

// Week View Component
const WeekView = ({ currentDate, events, onDateClick, onDragStart, onDragOver, onDrop, onEventComplete }) => {
  const startOfWeek = currentDate.startOf("week")
  const weekDays = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"))

  return (
    <div className="grid grid-cols-7 gap-2 mt-4">
      {weekDays.map((day) => (
        <div
          key={day.format("YYYY-MM-DD")}
          className="border rounded-lg p-2 min-h-32"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, day)}
        >
          <div
            className={`text-center font-semibold mb-2 ${
              day.isSame(dayjs(), "day") ? "text-blue-medium" : "text-gray-700"
            }`}
          >
            {day.format("ddd DD")}
          </div>
          <div className="space-y-1">
            {events
              .filter((event) => dayjs(event.date).isSame(day, "day"))
              .map((event) => (
                <div
                  key={event.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, event)}
                  className={`text-xs p-1 rounded cursor-move hover:scale-105 transition-transform ${
                    event.completed ? "line-through opacity-60" : ""
                  } ${getEventBgColor(event.type)}`}
                  title={`${event.title} - ${event.time}`}
                  onClick={() => onEventComplete(event.id)}
                >
                  {event.title}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Day View Component
const DayView = ({ currentDate, events, onEventComplete }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold text-primary-700 mb-4">{currentDate.format("dddd, MMMM DD, YYYY")}</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {hours.map((hour) => (
          <div key={hour} className="flex border-b border-gray-100 py-2">
            <div className="w-16 text-sm text-gray-500 font-medium">{hour.toString().padStart(2, "0")}:00</div>
            <div className="flex-1 pl-4">
              {events
                .filter((event) => Number.parseInt(event.time.split(":")[0]) === hour)
                .map((event) => (
                  <div
                    key={event.id}
                    className={`p-2 rounded-lg mb-1 cursor-pointer hover:scale-105 transition-transform ${
                      event.completed ? "line-through opacity-60" : ""
                    } ${getEventBgColor(event.type)}`}
                    onClick={() => onEventComplete(event.id)}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm opacity-75">
                      {event.time} {event.duration && `(${event.duration})`}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getEventBgColor(type) {
  if (type.includes("others:")) return "bg-mint-green text-gray-800"

  const colors = {
    birthday: "bg-pink-200 text-pink-800",
    festival: "bg-yellow-200 text-yellow-800",
    meeting: "bg-blue-light text-blue-800",
    important: "bg-red-200 text-red-800",
  }
  return colors[type] || "bg-mint-green text-gray-800"
}

export default Calendar
