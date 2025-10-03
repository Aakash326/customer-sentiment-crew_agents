import { useState } from 'react'
import { Plus, X, ArrowRight } from 'lucide-react'

export default function ComparisonMode({ onCompare, onBack }) {
  const [companies, setCompanies] = useState(['', '', ''])
  const [workflow, setWorkflow] = useState('fast')
  const [isComparing, setIsComparing] = useState(false)
  const [error, setError] = useState(null)

  const updateCompany = (index, value) => {
    const newCompanies = [...companies]
    newCompanies[index] = value
    setCompanies(newCompanies)
  }

  const removeCompany = (index) => {
    if (companies.filter(c => c.trim()).length > 2) {
      const newCompanies = companies.filter((_, i) => i !== index)
      setCompanies(newCompanies)
    }
  }

  const addCompany = () => {
    if (companies.length < 3) {
      setCompanies([...companies, ''])
    }
  }

  const handleCompare = async () => {
    const validCompanies = companies.filter(c => c.trim().length >= 2)

    if (validCompanies.length < 2) {
      setError('Please enter at least 2 company names')
      return
    }

    setIsComparing(true)
    setError(null)

    try {
      await onCompare(validCompanies, workflow)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsComparing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">
            Compare Companies
          </h2>
          <p className="text-gray-400">
            Analyze 2-3 companies side-by-side
          </p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
        >
          ← Back to Single Analysis
        </button>
      </div>

      {/* Company Inputs */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Companies to Compare</h3>
        <div className="space-y-3">
          {companies.map((company, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={company}
                  onChange={(e) => updateCompany(index, e.target.value)}
                  placeholder={`Company ${index + 1} (e.g., Apple, Tesla, Microsoft)`}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary transition-colors"
                  disabled={isComparing}
                />
                {company.trim() && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-sm">
                    ✓
                  </span>
                )}
              </div>
              {companies.length > 2 && (
                <button
                  onClick={() => removeCompany(index)}
                  disabled={isComparing}
                  className="px-3 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-red-400" />
                </button>
              )}
            </div>
          ))}
        </div>

        {companies.length < 3 && (
          <button
            onClick={addCompany}
            disabled={isComparing}
            className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add Another Company
          </button>
        )}
      </div>

      {/* Workflow Selection */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Analysis Type</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => setWorkflow('fast')}
            disabled={isComparing}
            className={`p-6 rounded-xl border-2 transition-all ${
              workflow === 'fast'
                ? 'border-primary bg-primary/10'
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold mb-1">Fast Analysis</h4>
            <p className="text-sm text-gray-400">~15 sec per company</p>
          </button>

          <button
            onClick={() => setWorkflow('deep')}
            disabled={isComparing}
            className={`p-6 rounded-xl border-2 transition-all ${
              workflow === 'deep'
                ? 'border-primary bg-primary/10'
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div className="text-2xl mb-2">🔍</div>
            <h4 className="font-semibold mb-1">Deep Analysis</h4>
            <p className="text-sm text-gray-400">~30 sec per company</p>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="glass rounded-xl p-4 border border-red-500/50 bg-red-500/10">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Compare Button */}
      <button
        onClick={handleCompare}
        disabled={isComparing}
        className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white text-xl font-bold rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
      >
        {isComparing ? (
          <>
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            Comparing Companies...
          </>
        ) : (
          <>
            <ArrowRight className="w-6 h-6" />
            Compare {companies.filter(c => c.trim()).length} Companies
          </>
        )}
      </button>
    </div>
  )
}
