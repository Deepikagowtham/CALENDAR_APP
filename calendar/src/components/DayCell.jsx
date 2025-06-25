"use client"

import { StickyNote, Plus, Camera } from "lucide-react"
import dayjs from "dayjs"

const DayCell = ({
  date,
  isCurrentMonth,
  isToday,
  isHoliday,
  events,
  note,
  image,
  onClick,
  onNoteClick,
  onImageClick,
  onDragStart,
  onDragOver,
  onDrop,
  onEventComplete,
}) => {
  const handleClick = () => {
    onClick(date.format("YYYY-MM-DD"))
  }

  const handleNoteClick = (e) => {
    e.stopPropagation()
    onNoteClick()
  }

  const handleImageClick = (e) => {
    e.stopPropagation()
    onImageClick()
  }

  // Check if there are upcoming events today
  const now = dayjs()
  const hasUpcomingEvents = events.some((event) => {
    if (event.completed) return false
    const eventDateTime = dayjs(`${event.date} ${event.time}`)
    return eventDateTime.isAfter(now) && date.isSame(now, "day")
  })

  // Check if there are events happening soon (within 2 hours)
  const hasSoonEvents = events.some((event) => {
    if (event.completed) return false
    const eventDateTime = dayjs(`${event.date} ${event.time}`)
    const timeDiff = eventDateTime.diff(now, "minute")
    return timeDiff > 0 && timeDiff <= 120 && date.isSame(eventDateTime, "day")
  })

  // Background style for images
  const backgroundStyle = image?.image
    ? {
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url("${image.image}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {}

  // Get holiday background color - Updated to purple
  const getHolidayBgColor = () => {
    if (!isHoliday) return ""

    switch (isHoliday.type) {
      case "sunday":
        return "bg-purple-100 border-purple-300"
      case "second-saturday":
      case "fourth-saturday":
        return "bg-purple-200 border-purple-400"
      default:
        return ""
    }
  }

  // Get base background classes
  const getBaseBackground = () => {
    if (image?.image) return ""
    if (isHoliday) return getHolidayBgColor()
    if (!isCurrentMonth) return "bg-gray-50 text-gray-400"
    return "bg-white"
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={backgroundStyle}
      className={`
        min-h-24 p-2 border cursor-pointer transition-all duration-200 hover:shadow-medium hover:scale-105 rounded-lg relative overflow-hidden group
        ${getBaseBackground()}
        ${isToday ? "ring-2 ring-blue-medium animate-pulse" : "border-gray-100"}
        ${!image?.image && !isHoliday ? "hover:bg-gradient-to-br hover:from-cream-beige hover:to-blue-light" : ""}
        ${note ? "border-l-4 border-l-blue-medium" : ""}
        ${image?.image ? "border-2 border-yellow-400 shadow-lg" : ""}
        ${isHoliday && !image?.image ? "shadow-sm" : ""}
      `}
    >
      {/* Holiday indicator - Updated to purple */}
      {isHoliday && !image?.image && (
        <div className="absolute top-1 left-1 pointer-events-none z-10">
          <div
            className={`w-2 h-2 rounded-full ${isHoliday.type === "sunday" ? "bg-purple-500" : "bg-purple-600"}`}
            title={isHoliday.name}
          ></div>
        </div>
      )}

      {/* Enhanced Animated decorations for upcoming events */}
      {hasUpcomingEvents && (
        <div className="absolute top-1 right-1 pointer-events-none z-10">
          {hasSoonEvents ? (
            // Butterfly for events happening soon (within 2 hours)
            <div className="animate-bounce-slow">
              <span className="text-2xl drop-shadow-lg animate-pulse">🦋</span>
            </div>
          ) : (
            // Flower for upcoming events
            <div className="animate-pulse">
              <span className="text-lg drop-shadow-md">🌸</span>
            </div>
          )}
        </div>
      )}

      {/* Monkey hanging for events happening very soon (within 30 minutes) */}
      {events.some((event) => {
        if (event.completed) return false
        const eventDateTime = dayjs(`${event.date} ${event.time}`)
        const timeDiff = eventDateTime.diff(now, "minute")
        return timeDiff > 0 && timeDiff <= 30 && date.isSame(eventDateTime, "day")
      }) && (
        <div className="absolute top-0 left-1 pointer-events-none z-10">
          <div className="animate-swing">
            <span className="text-2xl drop-shadow-lg">🐵</span>
          </div>
        </div>
      )}

      {/* Additional sparkle effect for today's upcoming events */}
      {isToday && hasUpcomingEvents && (
        <div className="absolute top-2 right-2 pointer-events-none z-10">
          <div className="animate-ping">
            <span className="text-sm">✨</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-1 relative z-10">
        <div
          className={`
            text-sm font-medium relative z-10
            ${isToday ? "text-blue-medium font-bold" : ""}
            ${image?.image ? "text-gray-900 font-bold drop-shadow-sm bg-white bg-opacity-80 px-1 rounded" : ""}
            ${isHoliday && !image?.image ? (isHoliday.type === "sunday" ? "text-purple-700 font-semibold" : "text-purple-800 font-semibold") : ""}
          `}
        >
          {date.format("D")}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex items-center gap-1 relative z-10">
          {/* Image Button */}
          {image?.image ? (
            <button
              onClick={handleImageClick}
              className="text-yellow-600 hover:text-yellow-700 transition-colors bg-white bg-opacity-90 rounded-full p-1 shadow-sm animate-pulse"
              title={`Picture: ${image.caption || "View image"}`}
            >
              <Camera size={14} />
            </button>
          ) : (
            <button
              onClick={handleImageClick}
              className="text-gray-400 hover:text-yellow-600 transition-colors opacity-0 group-hover:opacity-100 bg-white bg-opacity-80 hover:bg-yellow-50 rounded-full p-1"
              title="Add picture of the day"
            >
              <Camera size={12} />
            </button>
          )}

          {/* Note Button */}
          {note ? (
            <button
              onClick={handleNoteClick}
              className="text-blue-medium hover:text-blue-600 transition-colors animate-pulse bg-blue-50 bg-opacity-90 rounded-full p-1 shadow-sm"
              title={`View journal entry: ${note.substring(0, 50)}${note.length > 50 ? "..." : ""}`}
            >
              <StickyNote size={14} />
            </button>
          ) : (
            <button
              onClick={handleNoteClick}
              className="text-gray-400 hover:text-blue-medium transition-colors opacity-0 group-hover:opacity-100 bg-white bg-opacity-80 hover:bg-blue-50 rounded-full p-1"
              title="Add journal entry"
            >
              <Plus size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Image Caption */}
      {image?.caption && (
        <div className="mb-1 p-1 bg-yellow-100 bg-opacity-95 rounded text-xs text-yellow-800 truncate border-l-2 border-yellow-400 relative z-10 shadow-sm">
          📸 {image.caption}
        </div>
      )}

      {/* Note Preview */}
      {note && (
        <div className="mb-2 p-1 bg-blue-50 bg-opacity-95 rounded text-xs text-blue-800 truncate border-l-2 border-blue-300 relative z-10 shadow-sm">
          📝 {note.substring(0, 30)}
          {note.length > 30 ? "..." : ""}
        </div>
      )}

      <div className="space-y-1 relative z-10">
        {events.slice(0, note || image?.caption ? 1 : 3).map((event, index) => (
          <div
            key={event.id}
            draggable
            onDragStart={(e) => onDragStart(e, event)}
            className={`
              text-xs p-1 rounded truncate cursor-move hover:scale-105 transition-transform
              ${event.completed ? "line-through opacity-60" : ""}
              ${getEventBgColor(event.type)}
              ${(() => {
                if (event.completed) return ""
                const eventDateTime = dayjs(`${event.date} ${event.time}`)
                const timeDiff = eventDateTime.diff(now, "minute")
                if (timeDiff > 0 && timeDiff <= 30) return "animate-pulse ring-2 ring-yellow-300"
                if (timeDiff > 0 && timeDiff <= 120) return "animate-pulse"
                return ""
              })()}
              ${image?.image ? "bg-opacity-95 shadow-sm" : ""}
            `}
            title={`${event.title} - ${event.time} ${event.duration ? `(${event.duration})` : ""}`}
            onClick={(e) => {
              e.stopPropagation()
              onEventComplete(event.id)
            }}
          >
            {event.title}
          </div>
        ))}

        {events.length > (note || image?.caption ? 1 : 3) && (
          <div
            className={`text-xs text-blue-medium font-medium ${image?.image ? "bg-white bg-opacity-90 rounded px-1 shadow-sm" : ""}`}
          >
            +{events.length - (note || image?.caption ? 1 : 3)} more
          </div>
        )}
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

export default DayCell
