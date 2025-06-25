"use client"

import { useState, useRef } from "react"
import { Camera, Upload, X, Trash2, Eye } from "lucide-react"
import { compressImage } from "../utils/compressImage"

const ImageUpload = ({ date, existingImage, onSubmit, onCancel, onDelete }) => {
  const [selectedImage, setSelectedImage] = useState(existingImage || null)
  const [imagePreview, setImagePreview] = useState(existingImage || null)
  const [dragActive, setDragActive] = useState(false)
  const [caption, setCaption] = useState("")
  const fileInputRef = useRef(null)

  const handleFileSelect = async (file) => {
    try {
      // compress to keep localStorage small
      const imageData = await compressImage(file, {
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.7,
      })
      setSelectedImage(imageData)
      setImagePreview(imageData)
    } catch (err) {
      console.error("Image compression failed:", err)
      alert("Sorry, we couldn't process that image.")
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedImage) {
      onSubmit(date, { image: selectedImage, caption: caption.trim() })
    }
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to remove this picture of the day?")) {
      onDelete(date)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="animate-slideUp">
      <div className="flex items-center gap-2 mb-4">
        <Camera className="text-blue-medium" size={24} />
        <div>
          <h3 className="text-xl font-bold text-primary-800">Picture of the Day</h3>
          <p className="text-sm text-gray-600">Add a special memory for {new Date(date).toLocaleDateString()}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
            dragActive
              ? "border-blue-medium bg-blue-50"
              : imagePreview
                ? "border-green-300 bg-green-50"
                : "border-gray-300 hover:border-blue-light hover:bg-blue-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => window.open(imagePreview, "_blank")}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  title="View full size"
                >
                  <Eye size={16} />
                </button>
                <button
                  type="button"
                  onClick={removeImage}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">Drop your image here</p>
                <p className="text-sm text-gray-500">or click to browse</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-medium text-white px-4 py-2 rounded-lg hover:scale-105 transition-all"
                >
                  Choose Image
                </button>
              </div>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
        </div>

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Caption (optional)</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-medium focus:border-transparent transition-all"
            placeholder="Add a caption to your memory..."
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">{caption.length}/100 characters</p>
        </div>

        {/* Image Tips */}
        <div className="bg-mint-green bg-opacity-30 p-3 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">💡 Tips for great pictures:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Use high-quality images for best results</li>
            <li>• Square or landscape images work best</li>
            <li>• The image will be used as the date's background</li>
            <li>• Lighter images work better for text readability</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!selectedImage}
            className="flex-1 bg-blue-medium text-white py-3 px-4 rounded-lg hover:scale-105 hover:shadow-medium transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Camera size={16} />
            Set Picture of the Day
          </button>

          {existingImage && (
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

export default ImageUpload
