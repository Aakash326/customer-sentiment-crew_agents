import { X, Command, Keyboard } from 'lucide-react'

export default function KeyboardShortcuts({ onClose }) {
  const shortcuts = [
    { keys: ['⌘/Ctrl', 'Enter'], action: 'Start Analysis', description: 'Begin sentiment analysis' },
    { keys: ['ESC'], action: 'Stop/Close', description: 'Stop analysis or close modals' },
    { keys: ['⌘/Ctrl', 'K'], action: 'Focus Input', description: 'Jump to company name input' },
    { keys: ['⌘/Ctrl', 'N'], action: 'New Analysis', description: 'Reset and start fresh' },
    { keys: ['⌘/Ctrl', '/'], action: 'Show Shortcuts', description: 'Open this help dialog' },
    { keys: ['1'], action: 'Fast Workflow', description: 'Select fast analysis mode' },
    { keys: ['2'], action: 'Deep Workflow', description: 'Select deep analysis mode' },
    { keys: ['⌘/Ctrl', 'Shift', 'L'], action: 'Toggle Theme', description: 'Switch between light/dark mode' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fadeIn">
      <div className="glass rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Keyboard className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-white/80 mt-2">Navigate faster with keyboard shortcuts</p>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{shortcut.action}</h4>
                  <p className="text-sm text-gray-400">{shortcut.description}</p>
                </div>
                <div className="flex gap-2">
                  {shortcut.keys.map((key, i) => (
                    <kbd
                      key={i}
                      className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-lg text-sm font-mono shadow-md"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900/50 p-4 border-t border-white/10">
          <p className="text-sm text-gray-400 text-center flex items-center justify-center gap-2">
            <Command className="w-4 h-4" />
            Press <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">⌘/Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs">/</kbd> anytime to show shortcuts
          </p>
        </div>
      </div>
    </div>
  )
}
