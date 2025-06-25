/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#FAF7F0",
          100: "#CDFCF6",
          200: "#BCCEF8",
          300: "#98A8F8",
          400: "#7B8EF7",
          500: "#5E74F6",
          600: "#4A5EE8",
          700: "#3748D4",
          800: "#2A3BB8",
          900: "#1E2E9C",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "cream-beige": "#FAF7F0",
        "mint-green": "#CDFCF6",
        "blue-light": "#BCCEF8",
        "blue-medium": "#98A8F8",
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(135deg, #FAF7F0, #98A8F8)",
        "gradient-card": "linear-gradient(145deg, #CDFCF6, #BCCEF8)",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out",
        slideIn: "slideIn 0.6s ease-out",
        slideUp: "slideUp 0.4s ease-out",
        slideDown: "slideDown 0.3s ease-out",
        flipLeft: "flipLeft 0.6s ease-in-out",
        flipRight: "flipRight 0.6s ease-in-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        shake: "shake 0.5s ease-in-out",
        swing: "swing 1s ease-in-out infinite", // ✅ added swing animation
      },
      keyframes: {
        flipLeft: {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(-90deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        flipRight: {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(90deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
        },
        swing: { // ✅ keyframes for swing
          "0%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(10deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(152, 168, 248, 0.1), 0 10px 20px -2px rgba(152, 168, 248, 0.05)",
        medium: "0 4px 25px -5px rgba(152, 168, 248, 0.15), 0 10px 10px -5px rgba(152, 168, 248, 0.08)",
        strong: "0 10px 40px -10px rgba(152, 168, 248, 0.2), 0 2px 10px -2px rgba(152, 168, 248, 0.1)",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
