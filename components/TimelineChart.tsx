'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TimelineData {
  date: string
  amount: number
  formattedDate: string
}

interface TimelineChartProps {
  data: TimelineData[]
  period: string
}

export default function TimelineChart({ data, period }: TimelineChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-primary-600">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  const formatXAxisLabel = (tickItem: string) => {
    if (period === 'daily') {
      // For daily view, tickItem is already formatted as "HH:00"
      return tickItem
    }
    
    if (period === 'weekly') {
      // For weekly view, tickItem is day name
      return tickItem
    }
    
    if (period === 'monthly') {
      // For monthly view, tickItem is day number
      return tickItem
    }
    
    if (period === 'yearly') {
      // For yearly view, tickItem is month name
      return tickItem
    }
    
    return tickItem
  }

  if (data.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">📈</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos para mostrar</h3>
          <p className="text-gray-500">Agrega gastos para ver la evolución temporal</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Evolución de Gastos
        </h3>
        <p className="text-sm text-gray-500">
          {period === 'daily' && 'Gastos por día'}
          {period === 'weekly' && 'Gastos por semana'}
          {period === 'monthly' && 'Gastos por mes'}
          {period === 'yearly' && 'Gastos por año'}
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600 font-medium">Total</div>
          <div className="text-lg font-bold text-blue-900">
            {formatCurrency(data.reduce((sum, item) => sum + item.amount, 0))}
          </div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-600 font-medium">Promedio</div>
          <div className="text-lg font-bold text-green-900">
            {formatCurrency(data.reduce((sum, item) => sum + item.amount, 0) / data.length)}
          </div>
        </div>
      </div>
    </div>
  )
}
