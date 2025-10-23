import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Expense from '@/models/Expense'

// GET - Obtener gastos con filtros de fecha
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'daily'
    const date = searchParams.get('date') || new Date().toISOString()
    
    const targetDate = new Date(date)
    let startDate: Date
    let endDate: Date
    
    switch (period) {
      case 'daily':
        // Create dates in local timezone to avoid timezone issues
        startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0)
        endDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999)
        break
      case 'weekly':
        const dayOfWeek = targetDate.getDay()
        startDate = new Date(targetDate.setDate(targetDate.getDate() - dayOfWeek))
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + 6)
        endDate.setHours(23, 59, 59, 999)
        break
      case 'monthly':
        startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
        endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999)
        break
      case 'yearly':
        startDate = new Date(targetDate.getFullYear(), 0, 1)
        endDate = new Date(targetDate.getFullYear(), 11, 31, 23, 59, 59, 999)
        break
      default:
        startDate = new Date(targetDate.setHours(0, 0, 0, 0))
        endDate = new Date(targetDate.setHours(23, 59, 59, 999))
    }
    
    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 })
    
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    return NextResponse.json({
      expenses,
      total,
      period,
      dateRange: { startDate, endDate }
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Error al obtener los gastos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo gasto
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    const { description, amount, category, date } = body
    
    if (!description || !amount || !category) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }
    
    const expense = new Expense({
      description,
      amount: parseFloat(amount),
      category,
      date: date ? new Date(date) : new Date()
    })
    
    await expense.save()
    
    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: 'Error al crear el gasto' },
      { status: 500 }
    )
  }
}
