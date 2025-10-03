import { useState } from 'react'
import { Building2, X } from 'lucide-react'

const POPULAR_COMPANIES = [
  'Apple', 'Google', 'Microsoft', 'Tesla', 'Amazon',
  'Meta', 'Netflix', 'Twitter', 'Uber', 'Airbnb'
]

function CompanyInput({ value, onChange, disabled }) {
  const handleSuggestionClick = (company) => {
    onChange(company)
  }

  const handleClear = () => {
    onChange('')
  }

  return (
    <div className="glass rounded-2xl p-8 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Building2 className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold">Company Selection</h2>
      </div>

      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter company name (e.g., Apple, Tesla, Microsoft)"
          disabled={disabled}
          className="w-full px-6 py-4 bg-slate-800/50 border-2 border-purple-500/30 rounded-xl text-white text-lg placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Validation Message */}
      {value && value.trim().length < 2 && (
        <p className="mt-2 text-sm text-red-400">
          Please enter at least 2 characters
        </p>
      )}

      {/* Popular Suggestions */}
      <div className="mt-6">
        <p className="text-sm text-gray-400 mb-3">Popular companies:</p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_COMPANIES.map((company) => (
            <button
              key={company}
              onClick={() => handleSuggestionClick(company)}
              disabled={disabled}
              className="px-4 py-2 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-full text-sm hover:from-primary/30 hover:to-secondary/30 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {company}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CompanyInput
