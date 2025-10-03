import { useEffect } from 'react'

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} handlers - Object mapping keys to handler functions
 * @param {Array} dependencies - Dependencies array for useEffect
 */
export const useKeyboardShortcuts = (handlers, dependencies = []) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check for modifier keys
      const isCmdOrCtrl = event.metaKey || event.ctrlKey
      const isShift = event.shiftKey
      const isAlt = event.altKey

      // Don't trigger shortcuts when typing in input fields
      const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
        document.activeElement?.tagName
      )

      // Build key combination string
      let keyCombination = ''
      if (isCmdOrCtrl) keyCombination += 'cmd+'
      if (isShift) keyCombination += 'shift+'
      if (isAlt) keyCombination += 'alt+'
      keyCombination += event.key.toLowerCase()

      // Special handling for certain shortcuts
      // Cmd+K should work even when input is focused
      if (keyCombination === 'cmd+k') {
        event.preventDefault()
        if (handlers['cmd+k']) {
          handlers['cmd+k']()
        }
        return
      }

      // Cmd+/ should always work
      if (keyCombination === 'cmd+/') {
        event.preventDefault()
        if (handlers['cmd+/']) {
          handlers['cmd+/']()
        }
        return
      }

      // ESC should always work
      if (event.key === 'Escape') {
        if (handlers['escape']) {
          handlers['escape']()
        }
        return
      }

      // For other shortcuts, skip if input is focused
      if (isInputFocused && !isCmdOrCtrl) {
        return
      }

      // Execute handler if exists
      if (handlers[keyCombination]) {
        event.preventDefault()
        handlers[keyCombination]()
      }

      // Also check for simple key handlers
      if (!isCmdOrCtrl && !isShift && !isAlt && handlers[event.key]) {
        event.preventDefault()
        handlers[event.key]()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, dependencies)
}
