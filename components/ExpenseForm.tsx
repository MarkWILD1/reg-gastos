'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ExpenseFormProps {
  onSubmit: (expense: {
    description: string
    amount: number
    category: string
    date: string
  }) => void
  onCancel?: () => void
  initialData?: {
    description: string
    amount: number
    category: string
    date: string
  }
}

const categories = [
  'Alimentación',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Educación',
  'Ropa',
  'Hogar',
  'Otros'
]

export default function ExpenseForm({ onSubmit, onCancel, initialData }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    description: initialData?.description || '',
    amount: initialData?.amount || '',
    category: initialData?.category || '',
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd')
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount.toString())
      })
      
      if (!initialData) {
        setFormData({
          description: '',
          amount: '',
          category: '',
          date: format(new Date(), 'yyyy-MM-dd')
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <input
          type="text"
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="input-field"
          placeholder="¿En qué gastaste?"
          required
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Monto
        </label>
        <input
          type="number"
          id="amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="input-field"
          placeholder="0.00"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="input-field"
          required
        >
          <option value="">Selecciona una categoría</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Fecha
        </label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="input-field"
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar' : 'Agregar')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
