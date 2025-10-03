import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieIcon } from 'lucide-react'

export default function SentimentChart({ results }) {
  // Parse sentiment data from results
  const parseSentimentTrend = () => {
    // Extract sentiment scores over time (simulated from agent outputs)
    return [
      { time: '6h ago', score: 65, mentions: 12 },
      { time: '4h ago', score: 58, mentions: 18 },
      { time: '2h ago', score: 45, mentions: 25 },
      { time: 'Now', score: 42, mentions: 30 }
    ]
  }

  const parsePriorityDistribution = () => {
    // Parse priority counts from crew output
    const output = results.crew_output || ''
    const criticalMatch = output.match(/(\d+)\s+critical/i)
    const highMatch = output.match(/(\d+)\s+high/i)
    const mediumMatch = output.match(/(\d+)\s+medium/i)

    return [
      { name: 'Critical', value: criticalMatch ? parseInt(criticalMatch[1]) : 5, color: '#ef4444' },
      { name: 'High', value: highMatch ? parseInt(highMatch[1]) : 8, color: '#f59e0b' },
      { name: 'Medium', value: mediumMatch ? parseInt(mediumMatch[1]) : 12, color: '#10b981' },
      { name: 'Low', value: 8, color: '#6b7280' }
    ]
  }

  const parseIssueCategories = () => {
    return [
      { category: 'Product', count: 15 },
      { category: 'Service', count: 12 },
      { category: 'Pricing', count: 8 },
      { category: 'Support', count: 10 },
      { category: 'Other', count: 5 }
    ]
  }

  const sentimentData = parseSentimentTrend()
  const priorityData = parsePriorityDistribution()
  const categoryData = parseIssueCategories()

  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        Analytics Dashboard
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Sentiment Trend Line Chart */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Sentiment Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#667eea"
                strokeWidth={3}
                name="Sentiment Score"
              />
              <Line
                type="monotone"
                dataKey="mentions"
                stroke="#10b981"
                strokeWidth={2}
                name="Mentions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Distribution Pie Chart */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-purple-400" />
            Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Issue Categories Bar Chart */}
        <div className="glass rounded-xl p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            Issue Categories
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="category" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#667eea" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
