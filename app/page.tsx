'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import ExpenseForm from '@/components/ExpenseForm'
import ExpenseList from '@/components/ExpenseList'
import PeriodSelector from '@/components/PeriodSelector'
import StatsCard from '@/components/StatsCard'

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

export default function Home() {
  const [expenseData, setExpenseData] = useState<ExpenseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [currentPeriod, setCurrentPeriod] = useState('daily')
  const [currentDate, setCurrentDate] = useState(new Date())

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        period: currentPeriod,
        date: currentDate.toISOString()
      })
      
      const response = await fetch(`/api/expenses?${params}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar los gastos')
      }
      
      const data = await response.json()
      setExpenseData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [currentPeriod, currentDate])

  useEffect(() => {
    fetchExpenses()
  }, [currentPeriod, currentDate, fetchExpenses])

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
          <div className="mb-8">
            <StatsCard
              title={getPeriodTitle()}
              amount={expenseData.total}
              period={currentPeriod}
              dateRange={expenseData.dateRange}
            />
          </div>
        )}

        {/* Add Expense Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            + Agregar Gasto
          </button>
        </div>

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
