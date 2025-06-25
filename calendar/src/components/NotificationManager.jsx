"use client"

import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { Bell, X, Check, CheckCircle } from "lucide-react"

const NotificationManager = ({ events, onMarkCompleted, notificationTrigger }) => {
  const [notifications, setNotifications] = useState([])
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)

  useEffect(() => {
    const checkNotifications = () => {
      const now = dayjs()
      const today = now.format("YYYY-MM-DD")
      const currentTime = now.format("HH:mm")

      const upcomingEvents = []
      const belatedEvents = []
      const completedEvents = []

      events.forEach((event) => {
        const eventDate = dayjs(event.date)
        const eventTime = event.time

        // Check for recently completed events (completed in last 2 hours)
        if (event.completed && event.completedAt) {
          const completedTime = dayjs(event.completedAt)
          const timeSinceCompleted = now.diff(completedTime, "minute")

          if (timeSinceCompleted <= 120) {
            // Show for 2 hours after completion
            completedEvents.push({
              ...event,
              type: "completed",
              message: `✅ Completed: ${event.title}`,
              completedTime: completedTime.format("HH:mm"),
            })
          }
        }

        if (event.completed) return // Skip other checks for completed events

        // Check for upcoming events (within next 30 minutes)
        if (eventDate.isSame(now, "day")) {
          const eventDateTime = dayjs(`${event.date} ${eventTime}`)
          const timeDiff = eventDateTime.diff(now, "minute")

          if (timeDiff > 0 && timeDiff <= 30) {
            upcomingEvents.push({
              ...event,
              type: "upcoming",
              message: `${event.title} starts in ${timeDiff} minutes`,
            })
          }
        }

        // Check for belated events (past events that are not completed)
        if (eventDate.isBefore(now, "day") || (eventDate.isSame(now, "day") && eventTime < currentTime)) {
          belatedEvents.push({
            ...event,
            type: "belated",
            message: `${event.title} was scheduled for ${eventDate.format("MMM DD")} at ${eventTime}`,
          })
        }
      })

      const allNotifications = [...completedEvents, ...upcomingEvents, ...belatedEvents]
      setNotifications(allNotifications)

      // Show browser notifications for upcoming events
      upcomingEvents.forEach((event) => {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Upcoming Event: ${event.title}`, {
            body: event.message,
            icon: "/favicon.ico",
            tag: `event-${event.id}`,
          })
        }
      })

      // Show browser notifications for completed events
      completedEvents.forEach((event) => {
        if ("Notification" in window && Notification.permission === "granted" && !event.notificationShown) {
          new Notification(`Event Completed: ${event.title}`, {
            body: `✅ You completed this event at ${event.completedTime}`,
            icon: "/favicon.ico",
            tag: `completed-${event.id}`,
          })
        }
      })
    }

    // Check immediately and then every minute
    checkNotifications()
    const interval = setInterval(checkNotifications, 60000)

    return () => clearInterval(interval)
  }, [events, notificationTrigger])

  const handleMarkCompleted = (eventId) => {
    onMarkCompleted(eventId)
    setNotifications((prev) => prev.filter((notif) => notif.id !== eventId))
  }

  const dismissNotification = (eventId) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== eventId))
  }

  if (notifications.length === 0) return null

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotificationPanel(!showNotificationPanel)}
        className="fixed bottom-6 right-6 bg-blue-medium text-white p-3 rounded-full shadow-strong hover:scale-110 transition-all duration-200 z-40"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showNotificationPanel && (
        <div className="fixed bottom-20 right-6 bg-white rounded-xl shadow-strong p-4 w-80 max-h-96 overflow-y-auto z-50 animate-slideUp">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-primary-800">Notifications</h3>
            <button onClick={() => setShowNotificationPanel(false)} className="text-gray-500 hover:text-gray-700">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={`${notification.id}-${notification.type}`}
                className={`p-3 rounded-lg border-l-4 ${
                  notification.type === "upcoming"
                    ? "bg-blue-50 border-blue-medium"
                    : notification.type === "completed"
                      ? "bg-green-50 border-green-400"
                      : "bg-red-50 border-red-400"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm flex items-center gap-2">
                      {notification.type === "completed" && <CheckCircle size={14} className="text-green-600" />}
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    {notification.completedTime && (
                      <p className="text-xs text-green-600 mt-1">Completed at {notification.completedTime}</p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2">
                    {notification.type !== "completed" && (
                      <button
                        onClick={() => handleMarkCompleted(notification.id)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Mark as completed"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title="Dismiss"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default NotificationManager
