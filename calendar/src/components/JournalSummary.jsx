"use client"

import { useState } from "react"
import { BookOpen, Calendar, Search, X } from "lucide-react"
import dayjs from "dayjs"

const JournalSummary = ({ notes, onClose, onEditNote }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date-desc") // date-desc, date-asc, length

  const noteEntries = Object.entries(notes)
    .map(([date, note]) => ({
      date,
      note,
      wordCount: note
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length,
      mood: note.match(/^[😊😌😴😤🤔😢😡🤗😎🥳]/u)?.[0] || "",
      cleanNote: note.replace(/^[😊😌😴😤🤔😢😡🤗😎🥳]\s*/u, ""),
    }))
    .filter(
      (entry) =>
        entry.cleanNote.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dayjs(entry.date).format("MMMM DD, YYYY").toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
        case "date-desc":
          return dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1
        case "length":
          return b.wordCount - a.wordCount
        default:
          return 0
      }
    })

  const totalEntries = noteEntries.length
  const totalWords = noteEntries.reduce((sum, entry) => sum + entry.wordCount, 0)
  const averageWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden animate-slideUp shadow-strong">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-medium" size={24} />
            <div>
              <h2 className="text-2xl font-bold text-primary-800">Journal Summary</h2>
              <p className="text-sm text-gray-600">
                {totalEntries} entries • {totalWords} words • {averageWords} avg per entry
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">
            <X size={20} />
          </button>
        </div>

        {/* Search and Sort */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search your journal entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-medium focus:border-transparent"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-medium focus:border-transparent"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="length">Longest First</option>
          </select>
        </div>

        {/* Journal Entries */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {noteEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No entries match your search." : "No journal entries yet. Start writing!"}
            </div>
          ) : (
            noteEntries.map((entry) => (
              <div
                key={entry.date}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onEditNote(entry.date)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-blue-medium" />
                    <span className="font-medium text-primary-800">
                      {dayjs(entry.date).format("dddd, MMMM DD, YYYY")}
                    </span>
                    {entry.mood && <span className="text-lg">{entry.mood}</span>}
                  </div>
                  <span className="text-xs text-gray-500">{entry.wordCount} words</span>
                </div>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {entry.cleanNote.substring(0, 200)}
                  {entry.cleanNote.length > 200 && "..."}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default JournalSummary
