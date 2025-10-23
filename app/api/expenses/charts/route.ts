import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Expense from '@/models/Expense'

// GET - Obtener datos para gráficas
export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'daily'
    const date = searchParams.get('date') || new Date().toISOString()
    const chartType = searchParams.get('type') || 'all' // 'category', 'timeline', 'all'
    
    const targetDate = new Date(date)
    let startDate: Date
    let endDate: Date
    
    switch (period) {
      case 'daily':
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
    
    let responseData: any = {
      total,
      period,
      dateRange: { startDate, endDate }
    }
    
    // Datos para gráfica de categorías
    if (chartType === 'category' || chartType === 'all') {
      const categoryData = expenses.reduce((acc: any, expense) => {
        const category = expense.category
        if (acc[category]) {
          acc[category] += expense.amount
        } else {
          acc[category] = expense.amount
        }
        return acc
      }, {})
      
      const categoryChartData = Object.entries(categoryData).map(([category, amount]) => ({
        category,
        amount: amount as number,
        percentage: total > 0 ? ((amount as number) / total) * 100 : 0
      })).sort((a, b) => b.amount - a.amount)
      
      responseData.categoryData = categoryChartData
    }
    
    // Datos para gráfica de línea temporal
    if (chartType === 'timeline' || chartType === 'all') {
      let timelineData: any[] = []
      
      if (period === 'daily') {
        // Para vista diaria, agrupar por hora
        const hourlyData = expenses.reduce((acc: any, expense) => {
          const hour = new Date(expense.date).getHours()
          if (acc[hour]) {
            acc[hour] += expense.amount
          } else {
            acc[hour] = expense.amount
          }
          return acc
        }, {})
        
        timelineData = Object.entries(hourlyData).map(([hour, amount]) => ({
          date: `${hour}:00`,
          amount: amount as number,
          formattedDate: `${hour}:00`
        })).sort((a, b) => parseInt(a.date) - parseInt(b.date))
      } else if (period === 'weekly') {
        // Para vista semanal, agrupar por día de la semana
        const dailyData = expenses.reduce((acc: any, expense) => {
          const day = new Date(expense.date).getDay()
          const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
          const dayName = dayNames[day]
          if (acc[dayName]) {
            acc[dayName] += expense.amount
          } else {
            acc[dayName] = expense.amount
          }
          return acc
        }, {})
        
        timelineData = Object.entries(dailyData).map(([day, amount]) => ({
          date: day,
          amount: amount as number,
          formattedDate: day
        }))
      } else if (period === 'monthly') {
        // Para vista mensual, agrupar por día del mes
        const dailyData = expenses.reduce((acc: any, expense) => {
          const day = new Date(expense.date).getDate()
          if (acc[day]) {
            acc[day] += expense.amount
          } else {
            acc[day] = expense.amount
          }
          return acc
        }, {})
        
        timelineData = Object.entries(dailyData).map(([day, amount]) => ({
          date: day,
          amount: amount as number,
          formattedDate: `${day}`
        })).sort((a, b) => parseInt(a.date) - parseInt(b.date))
      } else if (period === 'yearly') {
        // Para vista anual, agrupar por mes
        const monthlyData = expenses.reduce((acc: any, expense) => {
          const month = new Date(expense.date).getMonth()
          const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
          const monthName = monthNames[month]
          if (acc[monthName]) {
            acc[monthName] += expense.amount
          } else {
            acc[monthName] = expense.amount
          }
          return acc
        }, {})
        
        timelineData = Object.entries(monthlyData).map(([month, amount]) => ({
          date: month,
          amount: amount as number,
          formattedDate: month
        }))
      }
      
      responseData.timelineData = timelineData
    }
    
    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error fetching chart data:', error)
    return NextResponse.json(
      { error: 'Error al obtener los datos de las gráficas' },
      { status: 500 }
    )
  }
}
