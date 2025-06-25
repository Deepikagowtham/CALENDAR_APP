"use client"

import { useState } from "react"
import { Camera, Calendar, Search, X, Eye, Trash2 } from "lucide-react"
import dayjs from "dayjs"

const MemoryGallery = ({ images, onClose, onEditImage, onDeleteImage }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date-desc")
  const [selectedImage, setSelectedImage] = useState(null)

  const imageEntries = Object.entries(images)
    .map(([date, imageData]) => ({
      date,
      ...imageData,
    }))
    .filter(
      (entry) =>
        entry.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dayjs(entry.date).format("MMMM DD, YYYY").toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
        case "date-desc":
          return dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1
        default:
          return 0
      }
    })

  const totalImages = imageEntries.length

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden animate-slideUp shadow-strong">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Camera className="text-blue-medium" size={24} />
            <div>
              <h2 className="text-2xl font-bold text-primary-800">Memory Gallery</h2>
              <p className="text-sm text-gray-600">{totalImages} pictures • Your visual memories</p>
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
              placeholder="Search your memories..."
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
          </select>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {imageEntries.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              {searchTerm ? "No images match your search." : "No pictures yet. Start capturing memories!"}
            </div>
          ) : (
            imageEntries.map((entry) => (
              <div
                key={entry.date}
                className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative">
                  <img
                    src={entry.image || "/placeholder.svg"}
                    alt={entry.caption || "Memory"}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setSelectedImage(entry)}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={() => setSelectedImage(entry)}
                        className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="View full size"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEditImage(entry.date)}
                        className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Edit"
                      >
                        <Camera size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteImage(entry.date)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={14} className="text-blue-medium" />
                    <span className="text-sm font-medium text-gray-800">
                      {dayjs(entry.date).format("MMM DD, YYYY")}
                    </span>
                  </div>
                  {entry.caption && (
                    <p className="text-xs text-gray-600 truncate" title={entry.caption}>
                      {entry.caption}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Full Size Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-60 animate-fadeIn"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] p-4">
              <img
                src={selectedImage.image || "/placeholder.svg"}
                alt={selectedImage.caption || "Memory"}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <X size={20} />
              </button>
              {selectedImage.caption && (
                <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white p-3 rounded-lg">
                  <p className="text-center">{selectedImage.caption}</p>
                  <p className="text-center text-sm text-gray-300 mt-1">
                    {dayjs(selectedImage.date).format("dddd, MMMM DD, YYYY")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MemoryGallery
