"use client"

import { useState, useEffect } from "react"
import Calendar from "./components/Calendar"
import EventForm from "./components/EventForm"
import NotificationManager from "./components/NotificationManager"
import NoteModal from "./components/NoteModal"
import JournalSummary from "./components/JournalSummary"
import ImageUpload from "./components/ImageUpload"
import MemoryGallery from "./components/MemoryGallery"
import { BookOpen, Camera } from "lucide-react"
import dayjs from "dayjs"
import "./index.css"

// --- localStorage helpers --------------------------------------------------
const isQuotaExceeded = (e) => e && (e.code === 22 || e.code === 1014 || e.name === "QuotaExceededError")

const trySetItem = (key, value) => {
  try {
    localStorage.setItem(key, value)
    return true
  } catch (e) {
    return !isQuotaExceeded(e) // return false only when quota error
  }
}

function App() {
  const [events, setEvents] = useState([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [eventFilter, setEventFilter] = useState({
    birthday: true,
    festival: true,
    meeting: true,
    important: true,
    others: true,
  })
  const [notes, setNotes] = useState({})
  const [images, setImages] = useState({})
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showJournalSummary, setShowJournalSummary] = useState(false)
  const [showMemoryGallery, setShowMemoryGallery] = useState(false)
  const [selectedNoteDate, setSelectedNoteDate] = useState(null)
  const [selectedImageDate, setSelectedImageDate] = useState(null)
  const [previousEventTitles, setPreviousEventTitles] = useState([])
  const [notificationTrigger, setNotificationTrigger] = useState(0)

  // Load events from JSON file
  useEffect(() => {
    fetch("/events.json")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data.events || [])
        // Extract previous titles for smart suggestions
        const titles = data.events?.map((event) => event.title) || []
        setPreviousEventTitles([...new Set(titles)])
      })
      .catch((error) => console.error("Error loading events:", error))

    // Load notes from localStorage
    const savedNotes = localStorage.getItem("calendar-notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }

    // Load images from localStorage
    const savedImages = localStorage.getItem("calendar-images")
    if (savedImages) {
      setImages(JSON.parse(savedImages))
    }

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("calendar-notes", JSON.stringify(notes))
  }, [notes])

  // Save images safely – remove oldest entries if quota exceeded
  useEffect(() => {
    const saveImages = () => {
      if (trySetItem("calendar-images", JSON.stringify(images))) return

      // quota exceeded → make a copy & prune oldest until it fits
      const pruned = { ...images }
      const datesAsc = Object.keys(pruned).sort() // oldest first
      while (datesAsc.length) {
        const oldest = datesAsc.shift()
        delete pruned[oldest]
        if (trySetItem("calendar-images", JSON.stringify(pruned))) {
          setImages(pruned) // update state with pruned list
          alert("Storage was full. Oldest pictures were removed automatically.")
          return
        }
      }
      // still failing – give up
      alert("Not enough browser storage for more pictures. Please delete some.")
    }

    saveImages()
  }, [images])

  const addEvent = (newEvent) => {
    const eventWithId = { ...newEvent, id: Date.now() }
    setEvents((prev) => [...prev, eventWithId])
    setShowEventForm(false)

    // Trigger notification refresh
    setNotificationTrigger((prev) => prev + 1)

    // Add title to previous titles for smart suggestions
    if (!previousEventTitles.includes(newEvent.title)) {
      setPreviousEventTitles((prev) => [...prev, newEvent.title])
    }
  }

  const updateEvent = (eventId, updatedEvent) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, ...updatedEvent } : event)))
  }

  const markEventCompleted = (eventId) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          const wasCompleted = event.completed
          return {
            ...event,
            completed: !event.completed,
            completedAt: !wasCompleted ? dayjs().toISOString() : event.completedAt, // Add completion timestamp
          }
        }
        return event
      }),
    )

    // Trigger notification refresh to show completion notification
    setNotificationTrigger((prev) => prev + 1)
  }

  const filteredEvents = events.filter((event) => {
    const eventType = event.type.includes("others:") ? "others" : event.type
    return eventFilter[eventType]
  })

  const toggleFilter = (type) => {
    setEventFilter((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const addNote = (date, note) => {
    setNotes((prev) => ({
      ...prev,
      [date]: note,
    }))
    setShowNoteModal(false)
  }

  const deleteNote = (date) => {
    setNotes((prev) => {
      const newNotes = { ...prev }
      delete newNotes[date]
      return newNotes
    })
    setShowNoteModal(false)
  }

  const addImage = (date, imageData) => {
    setImages((prev) => ({
      ...prev,
      [date]: imageData,
    }))
    setShowImageModal(false)
  }

  const deleteImage = (date) => {
    setImages((prev) => {
      const newImages = { ...prev }
      delete newImages[date]
      return newImages
    })
    setShowImageModal(false)
    setShowMemoryGallery(false)
  }

  const openNoteModal = (date) => {
    setSelectedNoteDate(date)
    setShowNoteModal(true)
  }

  const openImageModal = (date) => {
    setSelectedImageDate(date)
    setShowImageModal(true)
  }

  const openJournalFromSummary = (date) => {
    setShowJournalSummary(false)
    setSelectedNoteDate(date)
    setShowNoteModal(true)
  }

  const openImageFromGallery = (date) => {
    setShowMemoryGallery(false)
    setSelectedImageDate(date)
    setShowImageModal(true)
  }

  const noteCount = Object.keys(notes).length
  const imageCount = Object.keys(images).length

  return (
    <div className="min-h-screen bg-gradient-main animate-fadeIn">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-800 mb-2">Modern Calendar</h1>
          <p className="text-primary-600">Organize your life beautifully</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex gap-3">
            <button
              onClick={() => setShowEventForm(true)}
              className="bg-blue-medium text-white px-6 py-2 rounded-lg hover:scale-105 hover:shadow-medium transition-all duration-300 font-medium"
            >
              + Add Event
            </button>

            <button
              onClick={() => setShowJournalSummary(true)}
              className="bg-mint-green text-gray-800 px-6 py-2 rounded-lg hover:scale-105 hover:shadow-medium transition-all duration-300 font-medium flex items-center gap-2"
            >
              <BookOpen size={16} />
              Journal ({noteCount})
            </button>

            <button
              onClick={() => setShowMemoryGallery(true)}
              className="bg-yellow-300 text-gray-800 px-6 py-2 rounded-lg hover:scale-105 hover:shadow-medium transition-all duration-300 font-medium flex items-center gap-2"
            >
              <Camera size={16} />
              Memories ({imageCount})
            </button>
          </div>

          {/* Event Type Legend & Filters */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(eventFilter).map(([type, isActive]) => (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? getEventTypeColor(type) + " opacity-100 scale-100"
                    : "bg-gray-200 text-gray-500 opacity-50 scale-95"
                }`}
              >
                {getEventTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <Calendar
          events={filteredEvents}
          onDateClick={setSelectedDate}
          onEventUpdate={updateEvent}
          onEventComplete={markEventCompleted}
          notes={notes}
          images={images}
          onNoteClick={openNoteModal}
          onImageClick={openImageModal}
        />

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 animate-slideUp shadow-strong">
              <EventForm
                onSubmit={addEvent}
                onCancel={() => setShowEventForm(false)}
                selectedDate={selectedDate}
                previousTitles={previousEventTitles}
                existingEvents={events}
              />
            </div>
          </div>
        )}

        {/* Note Modal */}
        {showNoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 animate-slideUp shadow-strong max-h-[90vh] overflow-y-auto">
              <NoteModal
                date={selectedNoteDate}
                existingNote={notes[selectedNoteDate] || ""}
                onSubmit={addNote}
                onCancel={() => setShowNoteModal(false)}
                onDelete={deleteNote}
              />
            </div>
          </div>
        )}

        {/* Image Upload Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 animate-slideUp shadow-strong max-h-[90vh] overflow-y-auto">
              <ImageUpload
                date={selectedImageDate}
                existingImage={images[selectedImageDate] || null}
                onSubmit={addImage}
                onCancel={() => setShowImageModal(false)}
                onDelete={deleteImage}
              />
            </div>
          </div>
        )}

        {/* Journal Summary Modal */}
        {showJournalSummary && (
          <JournalSummary
            notes={notes}
            onClose={() => setShowJournalSummary(false)}
            onEditNote={openJournalFromSummary}
          />
        )}

        {/* Memory Gallery Modal */}
        {showMemoryGallery && (
          <MemoryGallery
            images={images}
            onClose={() => setShowMemoryGallery(false)}
            onEditImage={openImageFromGallery}
            onDeleteImage={deleteImage}
          />
        )}

        {/* Notification Manager */}
        <NotificationManager
          events={events}
          onMarkCompleted={markEventCompleted}
          notificationTrigger={notificationTrigger}
        />

      </div>
    </div>
  )
}

function getEventTypeColor(type) {
  const colors = {
    birthday: "bg-pink-200 text-pink-800",
    festival: "bg-yellow-200 text-yellow-800",
    meeting: "bg-blue-light text-blue-800",
    important: "bg-red-200 text-red-800",
    others: "bg-mint-green text-gray-800",
  }
  return colors[type] || colors.others
}

function getEventTypeIcon(type) {
  const icons = {
    birthday: "🎂",
    festival: "🎉",
    meeting: "💼",
    important: "❗",
    others: "➕",
  }
  return icons[type] || icons.others
}

export default App
