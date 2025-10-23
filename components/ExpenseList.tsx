'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Expense {
  _id: string
  description: string
  amount: number
  category: string
  date: string
  createdAt: string
  updatedAt: string
}

interface ExpenseListProps {
  expenses: Expense[]
  onEdit?: (expense: Expense) => void
  onDelete?: (id: string) => void
}

const categoryColors: { [key: string]: string } = {
  'Alimentación': 'bg-red-100 text-red-800',
  'Transporte': 'bg-blue-100 text-blue-800',
  'Entretenimiento': 'bg-purple-100 text-purple-800',
  'Salud': 'bg-green-100 text-green-800',
  'Educación': 'bg-yellow-100 text-yellow-800',
  'Ropa': 'bg-pink-100 text-pink-800',
  'Hogar': 'bg-indigo-100 text-indigo-800',
  'Otros': 'bg-gray-100 text-gray-800'
}

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy', { locale: es })
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">💰</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay gastos registrados</h3>
        <p className="text-gray-500">Agrega tu primer gasto para comenzar</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div key={expense._id} className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="font-medium text-gray-900">{expense.description}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[expense.category] || categoryColors['Otros']}`}>
                  {expense.category}
                </span>
              </div>
              <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </span>
              
              {(onEdit || onDelete) && (
                <div className="flex gap-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(expense._id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
