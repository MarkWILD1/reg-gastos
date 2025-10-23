'use client'

interface StatsCardProps {
  title: string
  amount: number
  period: string
  dateRange: {
    startDate: string
    endDate: string
  }
}

export default function StatsCard({ title, amount, period, dateRange }: StatsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDateRange = () => {
    const start = new Date(dateRange.startDate)
    const end = new Date(dateRange.endDate)
    
    if (period === 'daily') {
      return start.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }
    
    if (period === 'weekly') {
      return `${start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`
    }
    
    if (period === 'monthly') {
      return start.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      })
    }
    
    if (period === 'yearly') {
      return start.getFullYear().toString()
    }
    
    return ''
  }

  return (
    <div className="card">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="text-3xl font-bold text-primary-600 mb-2">
          {formatCurrency(amount)}
        </div>
        <p className="text-sm text-gray-500">
          {formatDateRange()}
        </p>
      </div>
    </div>
  )
}
