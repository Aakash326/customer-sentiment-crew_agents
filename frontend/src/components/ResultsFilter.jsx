import { Search, Filter, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'

export default function ResultsFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    severity: 'all',
    keyword: '',
    sentiment: 'all',
    sortBy: 'priority'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters = {
      severity: 'all',
      keyword: '',
      sentiment: 'all',
      sortBy: 'priority'
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const hasActiveFilters =
    filters.severity !== 'all' ||
    filters.keyword !== '' ||
    filters.sentiment !== 'all' ||
    filters.sortBy !== 'priority'

  return (
    <div className="glass rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          Filter & Search Results
        </h3>
        <div className="flex gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1 transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {/* Keyword Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={filters.keyword}
            onChange={(e) => updateFilter('keyword', e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Severity Filter */}
        <select
          value={filters.severity}
          onChange={(e) => updateFilter('severity', e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
        >
          <option value="all">All Severities</option>
          <option value="critical">🔴 Critical Only</option>
          <option value="high">🟠 High Priority</option>
          <option value="medium">🟡 Medium Priority</option>
          <option value="low">🟢 Low Priority</option>
        </select>

        {/* Sort By */}
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
        >
          <option value="priority">Sort: Priority (High to Low)</option>
          <option value="priority-asc">Sort: Priority (Low to High)</option>
          <option value="recent">Sort: Most Recent</option>
          <option value="mentions">Sort: Most Mentions</option>
        </select>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          {/* Sentiment Filter */}
          <select
            value={filters.sentiment}
            onChange={(e) => updateFilter('sentiment', e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
          >
            <option value="all">All Sentiments</option>
            <option value="negative">😞 Negative Only</option>
            <option value="neutral">😐 Neutral Only</option>
            <option value="positive">😊 Positive Only</option>
          </select>

          {/* Active Filters Count */}
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-400">
              {hasActiveFilters ? (
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg">
                  {Object.values(filters).filter(v => v !== 'all' && v !== '' && v !== 'priority').length} active filter(s)
                </span>
              ) : (
                'No active filters'
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
