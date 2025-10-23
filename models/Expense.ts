import mongoose, { Document, Schema } from 'mongoose'

export interface IExpense extends Document {
  description: string
  amount: number
  category: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

const ExpenseSchema = new Schema<IExpense>({
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    maxlength: [200, 'La descripción no puede exceder 200 caracteres']
  },
  amount: {
    type: Number,
    required: [true, 'El monto es requerido'],
    min: [0, 'El monto debe ser mayor a 0']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    trim: true,
    maxlength: [50, 'La categoría no puede exceder 50 caracteres']
  },
  date: {
    type: Date,
    required: [true, 'La fecha es requerida'],
    default: Date.now
  }
}, {
  timestamps: true
})

// Índices para optimizar consultas
ExpenseSchema.index({ date: -1 })
ExpenseSchema.index({ category: 1 })
ExpenseSchema.index({ date: -1, category: 1 })

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema)
