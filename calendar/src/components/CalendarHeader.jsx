"use client"

import { ChevronLeft, ChevronRight, Calendar, Grid, List } from "lucide-react"

const CalendarHeader = ({ currentDate, onNavigate, onToday, viewMode, onViewModeChange }) => {
  return (
    <div className="relative mb-6">
      {/* Background Image Container */}
      <div
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-pink-400 p-8 mb-4"
        style={{
          backgroundImage: `url('/images/calendar-bg.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "200px",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-purple-800/20 to-pink-600/30"></div>

        {/* Header Content */}
        <div className="relative z-10 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {currentDate.format("MMMM YYYY")}
            </h2>
            <button
              onClick={onToday}
              className="px-4 py-2 text-sm bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/30 font-medium shadow-lg"
            >
              Today
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/30 shadow-lg">
              <button
                onClick={() => onViewModeChange("month")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "month" ? "bg-white text-purple-600 shadow-md" : "text-white hover:bg-white/20"
                }`}
                title="Month View"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => onViewModeChange("week")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "week" ? "bg-white text-purple-600 shadow-md" : "text-white hover:bg-white/20"
                }`}
                title="Week View"
              >
                <Calendar size={16} />
              </button>
              <button
                onClick={() => onViewModeChange("day")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "day" ? "bg-white text-purple-600 shadow-md" : "text-white hover:bg-white/20"
                }`}
                title="Day View"
              >
                <List size={16} />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/30 shadow-lg">
              <button
                onClick={() => onNavigate(-1)}
                className="p-2 rounded-lg hover:bg-white/20 text-white hover:scale-110 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => onNavigate(1)}
                className="p-2 rounded-lg hover:bg-white/20 text-white hover:scale-110 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-4 left-8 text-white/60 text-sm font-medium">📅 Your Beautiful Calendar</div>

        {/* Floating Calendar Icon */}
        <div className="absolute top-4 right-8 text-white/40 animate-float">
          <Calendar size={32} />
        </div>
      </div>
    </div>
  )
}

export default CalendarHeader
