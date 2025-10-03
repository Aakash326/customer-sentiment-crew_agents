import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-5 h-5 text-yellow-400" />
          <span className="hidden md:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-blue-400" />
          <span className="hidden md:inline">Dark</span>
        </>
      )}
    </button>
  )
}
