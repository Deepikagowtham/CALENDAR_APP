# 🗓️ Modern Calendar App

A beautiful, feature-rich calendar application built with React, featuring event management, smart notifications, drag-and-drop functionality, and daily journaling.

## ✨ Features

- 📅 **Multiple Views**: Month, Week, and Day views
- 🎯 **Smart Event Management**: Add, edit, and complete events
- 🔔 **Intelligent Notifications**: Upcoming and overdue event alerts
- 🎨 **Beautiful Animations**: Flip transitions, hover effects, and decorative elements
- 📝 **Daily Journaling**: Personal notes for each day
- 🖱️ **Drag & Drop**: Reschedule events by dragging
- 🎭 **Event Decorations**: Animated monkeys, butterflies, and flowers for upcoming events
- 🎨 **Modern Design**: Cream, mint, and blue color palette
- 📱 **Responsive**: Works on all devices

## 🚀 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Step 1: Clone or Download
If you have the project files, navigate to the project directory:
\`\`\`bash
cd modern-calendar-app
\`\`\`

### Step 2: Install Dependencies
\`\`\`bash
npm install
\`\`\`

Or if you prefer yarn:
\`\`\`bash
yarn install
\`\`\`

### Step 3: Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Or with yarn:
\`\`\`bash
yarn dev
\`\`\`

The application will open automatically in your browser at `http://localhost:3000`

### Step 4: Build for Production (Optional)
\`\`\`bash
npm run build
\`\`\`

Or with yarn:
\`\`\`bash
yarn build
\`\`\`

## 🎯 Usage

### Adding Events
1. Click the "Add Event" button
2. Fill in event details (title, date, time, duration, type)
3. Use smart suggestions for titles and available times
4. Submit to add the event

### Event Management
- **Complete Events**: Click on any event to mark it as completed
- **Drag & Drop**: Drag events between dates to reschedule
- **Filter Events**: Use the type badges to filter by event category

### Daily Notes
1. Click on any date
2. Write your daily thoughts, feelings, or reminders
3. Notes are saved locally in your browser

### Notifications
- Browser notifications appear 30 minutes before events
- Click the bell icon to see all notifications
- Mark overdue events as completed from the notification panel

### Visual Indicators
- 🐵 **Monkey**: Events starting within 30 minutes
- 🦋 **Butterfly**: Events starting within 2 hours
- 🌸 **Flower**: Upcoming events today
- 📝 **Note Icon**: Days with journal entries

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
\`\`\`
src/
├── components/
│   ├── Calendar.jsx          # Main calendar component
│   ├── CalendarHeader.jsx    # Navigation and view controls
│   ├── DayCell.jsx          # Individual day cells
│   ├── EventForm.jsx        # Event creation form
│   ├── NotificationManager.jsx # Notification system
│   └── NoteModal.jsx        # Daily journal modal
├── App.jsx                  # Main application
├── main.jsx                 # Entry point
└── index.css               # Styles and animations
\`\`\`

## 🎨 Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`:
- Cream Beige: `#FAF7F0`
- Mint Green: `#CDFCF6`
- Blue Light: `#BCCEF8`
- Blue Medium: `#98A8F8`

### Event Types
Event types and their colors can be customized in the `getEventBgColor` function in various components.

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

**Note**: Notification features require modern browsers with Notification API support.

## 🔧 Troubleshooting

### Common Issues

1. **Notifications not working**: 
   - Ensure browser notifications are enabled
   - Check if the site has notification permissions

2. **Events not saving**:
   - Check browser console for errors
   - Ensure the events.json file is accessible

3. **Animations not smooth**:
   - Disable browser extensions that might interfere
   - Check if hardware acceleration is enabled

### Performance Tips
- The app stores notes locally using localStorage
- Events are loaded from a JSON file on startup
- Clear browser cache if experiencing issues

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the calendar app!

---

Enjoy organizing your life with the Modern Calendar App! 🎉
