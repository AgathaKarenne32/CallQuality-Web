/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Azul Royal
        secondary: '#64748b', // Cinza Slate
        background: '#f8fafc', // Cinza Gelo
        surface: '#ffffff', // Branco
        success: '#22c55e',
        warning: '#eab308',
        danger: '#ef4444',
      }
    },
  },
  plugins: [],
}
