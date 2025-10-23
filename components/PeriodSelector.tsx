'use client'

interface PeriodSelectorProps {
  currentPeriod: string
  onPeriodChange: (period: string) => void
  currentDate: Date
  onDateChange: (date: Date) => void
}

const periods = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' }
]

export default function PeriodSelector({ 
  currentPeriod, 
  onPeriodChange, 
  currentDate, 
  onDateChange 
}: PeriodSelectorProps) {
  const formatDateForInput = (date: Date) => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateChange = (dateString: string) => {
    onDateChange(new Date(dateString))
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex gap-2">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => onPeriodChange(period.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPeriod === period.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <label htmlFor="date-selector" className="text-sm font-medium text-gray-700">
          Fecha:
        </label>
        <input
          id="date-selector"
          type="date"
          value={formatDateForInput(currentDate)}
          onChange={(e) => handleDateChange(e.target.value)}
          className="input-field w-auto"
        />
      </div>
    </div>
  )
}
