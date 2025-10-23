'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import ExpenseForm from '@/components/ExpenseForm'
import ExpenseList from '@/components/ExpenseList'
import PeriodSelector from '@/components/PeriodSelector'
import StatsCard from '@/components/StatsCard'
import CategoryChart from '@/components/CategoryChart'
import TimelineChart from '@/components/TimelineChart'

interface Expense {
  _id: string
  description: string
  amount: number
  category: string
  date: string
  createdAt: string
  updatedAt: string
}

interface ExpenseData {
  expenses: Expense[]
  total: number
  period: string
  dateRange: {
    startDate: string
    endDate: string
  }
}

interface ChartData {
  categoryData?: Array<{
    category: string
    amount: number
    percentage: number
  }>
  timelineData?: Array<{
    date: string
    amount: number
    formattedDate: string
  }>
  total: number
  period: string
  dateRange: {
    startDate: string
    endDate: string
  }
}

export default function Home() {
  const [expenseData, setExpenseData] = useState<ExpenseData | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [currentPeriod, setCurrentPeriod] = useState('daily')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showCharts, setShowCharts] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Format date as YYYY-MM-DD to avoid timezone issues
      const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
      
      const params = new URLSearchParams({
        period: currentPeriod,
        date: dateString
      })
      
      // Fetch both expenses and chart data in parallel
      const [expensesResponse, chartsResponse] = await Promise.all([
        fetch(`/api/expenses?${params}`),
        fetch(`/api/expenses/charts?${params}`)
      ])
      
      if (!expensesResponse.ok) {
        throw new Error('Error al cargar los gastos')
      }
      
      if (!chartsResponse.ok) {
        throw new Error('Error al cargar los datos de las gráficas')
      }
      
      const [expensesData, chartsData] = await Promise.all([
        expensesResponse.json(),
        chartsResponse.json()
      ])
      
      setExpenseData(expensesData)
      setChartData(chartsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [currentPeriod, currentDate])

  useEffect(() => {
    fetchExpenses()
  }, [currentPeriod, currentDate, fetchExpenses])

  // Detect mobile device and set initial chart visibility
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 // Tailwind's md breakpoint
      setIsMobile(mobile)
      // On mobile, charts start collapsed; on desktop, they start expanded
      setShowCharts(!mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleAddExpense = async (expenseData: {
    description: string
    amount: number
    category: string
    date: string
  }) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      })

      if (!response.ok) {
        throw new Error('Error al crear el gasto')
      }

      setShowForm(false)
      fetchExpenses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el gasto')
    }
  }

  const handleEditExpense = async (expenseData: {
    description: string
    amount: number
    category: string
    date: string
  }) => {
    if (!editingExpense) return

    try {
      const response = await fetch(`/api/expenses/${editingExpense._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el gasto')
      }

      setEditingExpense(null)
      fetchExpenses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el gasto')
    }
  }

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este gasto?')) return

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el gasto')
      }

      fetchExpenses()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el gasto')
    }
  }

  const getPeriodTitle = () => {
    switch (currentPeriod) {
      case 'daily': return 'Gastos del día'
      case 'weekly': return 'Gastos de la semana'
      case 'monthly': return 'Gastos del mes'
      case 'yearly': return 'Gastos del año'
      default: return 'Gastos'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando gastos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registro de Gastos</h1>
          <p className="text-gray-600">Controla tus gastos de forma simple y efectiva</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm font-medium mt-2"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Period Selector */}
        <div className="mb-6">
          <PeriodSelector
            currentPeriod={currentPeriod}
            onPeriodChange={setCurrentPeriod}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
        </div>

        {/* Stats Card */}
        {expenseData && (
          <div className="mb-6">
            <StatsCard
              title={getPeriodTitle()}
              amount={expenseData.total}
              period={currentPeriod}
              dateRange={expenseData.dateRange}
            />
          </div>
        )}

        {/* Add Expense Button */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            + Agregar Gasto
          </button>
        </div>

        {/* Charts Section */}
        {chartData && (
          <div className="mb-8">
            {/* Charts Toggle Button - Only show on mobile */}
            {isMobile && (
              <div className="mb-4">
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className="charts-toggle"
                >
                  <div className="charts-toggle-content">
                    <div className="text-2xl">📊</div>
                    <div className="charts-toggle-text">
                      <h3 className="charts-toggle-title">Gráficas y Análisis</h3>
                      <p className="charts-toggle-subtitle">
                        {showCharts ? 'Ocultar gráficas' : 'Ver gráficas detalladas'}
                      </p>
                    </div>
                  </div>
                  <div className={`charts-toggle-icon ${showCharts ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
              </div>
            )}

            {/* Charts Content */}
            {(!isMobile || showCharts) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Chart */}
                {chartData.categoryData && chartData.categoryData.length > 0 && (
                  <CategoryChart 
                    data={chartData.categoryData} 
                    period={currentPeriod} 
                  />
                )}
                
                {/* Timeline Chart */}
                {chartData.timelineData && chartData.timelineData.length > 0 && (
                  <TimelineChart 
                    data={chartData.timelineData} 
                    period={currentPeriod} 
                  />
                )}
              </div>
            )}

            {/* Mobile Charts Summary - Show when collapsed */}
            {isMobile && !showCharts && chartData && (
              <div className="grid grid-cols-2 gap-4">
                {/* Quick Category Summary */}
                {chartData.categoryData && chartData.categoryData.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-blue-600">🥧</div>
                      <h4 className="font-medium text-blue-900">Top Categoría</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      {chartData.categoryData[0].category}
                    </p>
                    <p className="text-xs text-blue-600">
                      {chartData.categoryData[0].percentage.toFixed(1)}% del total
                    </p>
                  </div>
                )}

                {/* Quick Timeline Summary */}
                {chartData.timelineData && chartData.timelineData.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-green-600">📈</div>
                      <h4 className="font-medium text-green-900">Promedio</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(chartData.timelineData.reduce((sum, item) => sum + item.amount, 0) / chartData.timelineData.length)}
                    </p>
                    <p className="text-xs text-green-600">
                      por período
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}


        {/* Expense Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Agregar Gasto</h2>
                <ExpenseForm
                  onSubmit={handleAddExpense}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Expense Modal */}
        {editingExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Editar Gasto</h2>
                <ExpenseForm
                  initialData={{
                    description: editingExpense.description,
                    amount: editingExpense.amount,
                    category: editingExpense.category,
                    date: format(new Date(editingExpense.date), 'yyyy-MM-dd')
                  }}
                  onSubmit={handleEditExpense}
                  onCancel={() => setEditingExpense(null)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Expense List */}
        {expenseData && (
          <div>
            <ExpenseList
              expenses={expenseData.expenses}
              onEdit={setEditingExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        )}
      </div>
    </div>
  )
}
