"use client"

import { useState, useEffect } from "react"
import { Calendar, Save, X, Trash2, BookOpen } from "lucide-react"
import dayjs from "dayjs"

const NoteModal = ({ date, existingNote, onSubmit, onCancel, onDelete }) => {
  const [note, setNote] = useState(existingNote || "")
  const [wordCount, setWordCount] = useState(0)
  const [mood, setMood] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const templates = [
    {
      id: "gratitude",
      name: "Gratitude Journal",
      icon: "🙏",
      template: "Today I'm grateful for:\n1. \n2. \n3. \n\nWhat made me smile today:\n\nHow I felt today:\n",
    },
    {
      id: "reflection",
      name: "Daily Reflection",
      icon: "🤔",
      template: "What went well today:\n\nWhat could have been better:\n\nWhat I learned:\n\nTomorrow I will:\n",
    },
    {
      id: "goals",
      name: "Goals & Progress",
      icon: "🎯",
      template: "Today's accomplishments:\n\nProgress on goals:\n\nChallenges faced:\n\nNext steps:\n",
    },
    {
      id: "mood",
      name: "Mood Tracker",
      icon: "😊",
      template: "How I'm feeling: \n\nEnergy level (1-10): \n\nWhat influenced my mood:\n\nSelf-care activities:\n",
    },
    {
      id: "free",
      name: "Free Writing",
      icon: "✍️",
      template: "",
    },
  ]

  const moods = [
    { emoji: "😊", label: "Happy" },
    { emoji: "😌", label: "Calm" },
    { emoji: "😴", label: "Tired" },
    { emoji: "😤", label: "Stressed" },
    { emoji: "🤔", label: "Thoughtful" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😡", label: "Angry" },
    { emoji: "🤗", label: "Grateful" },
    { emoji: "😎", label: "Confident" },
    { emoji: "🥳", label: "Excited" },
  ]

  useEffect(() => {
    setWordCount(
      note
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
    )
  }, [note])

  const handleSubmit = (e) => {
    e.preventDefault()
    const fullNote = mood ? `${mood} ${note}` : note
    onSubmit(date, fullNote.trim())
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      onDelete(date)
    }
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id)
    setNote(template.template)
  }

  const formattedDate = dayjs(date).format("dddd, MMMM DD, YYYY")
  const isToday = dayjs(date).isSame(dayjs(), "day")
  const isPast = dayjs(date).isBefore(dayjs(), "day")
  const isFuture = dayjs(date).isAfter(dayjs(), "day")

  return (
    <div className="animate-slideUp max-h-[90vh] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="text-blue-medium" size={24} />
        <div>
          <h3 className="text-xl font-bold text-primary-800">Daily Journal</h3>
          <p className="text-sm text-gray-600">
            {isToday && "Reflect on your day"}
            {isPast && "Looking back"}
            {isFuture && "Planning ahead"}
          </p>
        </div>
      </div>

      <div className="mb-4 p-4 bg-gradient-to-r from-cream-beige to-mint-green rounded-lg">
        <p className="text-sm font-medium text-primary-700 flex items-center gap-2">
          <Calendar size={16} />
          {formattedDate}
        </p>
        <p className="text-xs text-primary-600 mt-1">
          {isToday && "What happened today? How are you feeling?"}
          {isPast && "What do you remember about this day?"}
          {isFuture && "What are you planning or hoping for?"}
        </p>
      </div>

      {/* Mood Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling?</label>
        <div className="flex flex-wrap gap-2">
          {moods.map((moodOption) => (
            <button
              key={moodOption.label}
              type="button"
              onClick={() => setMood(mood === moodOption.emoji ? "" : moodOption.emoji)}
              className={`p-2 rounded-lg border transition-all ${
                mood === moodOption.emoji
                  ? "border-blue-medium bg-blue-50 scale-110"
                  : "border-gray-200 hover:border-blue-light hover:bg-blue-50"
              }`}
              title={moodOption.label}
            >
              <span className="text-lg">{moodOption.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Template Selector */}
      {!existingNote && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Choose a template (optional)</label>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template)}
                className={`p-2 text-left rounded-lg border transition-all ${
                  selectedTemplate === template.id
                    ? "border-blue-medium bg-blue-50"
                    : "border-gray-200 hover:border-blue-light hover:bg-blue-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{template.icon}</span>
                  <span className="text-xs font-medium">{template.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your thoughts for {isToday ? "today" : "this day"}...
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-medium focus:border-transparent transition-all resize-none"
            rows="10"
            placeholder={
              isToday
                ? "Write about your day, thoughts, feelings, achievements, or anything you want to remember..."
                : isPast
                  ? "What do you remember about this day? Any thoughts or reflections?"
                  : "What are you planning or hoping for this day?"
            }
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </p>
            <p className="text-xs text-gray-500">{note.length}/2000 characters</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setNote(note + "\n\n💡 Idea: ")}
            className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition-colors"
          >
            💡 Add Idea
          </button>
          <button
            type="button"
            onClick={() => setNote(note + "\n\n🎯 Goal: ")}
            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors"
          >
            🎯 Add Goal
          </button>
          <button
            type="button"
            onClick={() => setNote(note + "\n\n⭐ Highlight: ")}
            className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 transition-colors"
          >
            ⭐ Add Highlight
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-blue-medium text-white py-3 px-4 rounded-lg hover:scale-105 hover:shadow-medium transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Save Journal Entry
          </button>

          {existingNote && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default NoteModal
