/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        panel: '#1e293b',
        accent: '#3b82f6',
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#22c55e',
      }
    },
  },
  plugins: [],
}
