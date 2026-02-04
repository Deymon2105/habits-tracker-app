import { supabase } from '../lib/supabase'

const parseLocalDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number)
  
  return new Date(year, month - 1, day)
}

// CRUD DE SEMANAS

// Funcion para obtener todas las semanas ordenadas por fecha de inicio descendente
export const fetchWeeks = async () => {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .order('start_date', { ascending: false })
  return { data, error }
}

// Funcion para crear nueva semana y generar automáticamente los 7 días
export const createWeekService = async (startDate, endDate) => {
  let start = parseLocalDate(startDate)
  let end = endDate ? parseLocalDate(endDate) : new Date(start)
  
  if (!endDate) {
     end.setDate(start.getDate() + 6)
  }

  // Primero creamos la semana
  const { data: week, error: weekError } = await supabase
    .from('weeks')
    .insert([{
      name: `Semana del ${start.toLocaleDateString('es-ES')}`,
      start_date: startDate,
      end_date: end.toISOString().split('T')[0]
    }])
    .select()
    .single()

  if (weekError) return { data: null, error: weekError }

  // Segundo creamos los días para esa semana
  const days = []
  let current = new Date(start)
  
  // Generar 7 días siempre para mantener consistencia visual
  for (let i = 0; i < 7; i++) {
    // Formatear fecha como YYYY-MM-DD en zona horaria local
    const year = current.getFullYear()
    const month = String(current.getMonth() + 1).padStart(2, '0')
    const day = String(current.getDate()).padStart(2, '0')
    
    days.push({
      week_id: week.id,
      date: `${year}-${month}-${day}`,
      is_completed: false
    })
    current.setDate(current.getDate() + 1)
  }

  const { error: daysError } = await supabase
    .from('days')
    .insert(days)

  if (daysError) {
    return { data: week, error: daysError }
  }

  return { data: week, error: null }
}

// Funcion para eliminar una semana y todos sus días y hábitos asociados
export const deleteWeekService = async (weekId) => {
  const { error } = await supabase
    .from('weeks')
    .delete()
    .eq('id', weekId)
  
  return { error }
}

// Funcion para obtener la información de una semana específica por su ID
export const fetchWeekById = async (weekId) => {
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('id', weekId)
    .single()
    
  return { data, error }
}

// Funcion para obtener los días asociados a una semana, incluyendo sus hábitos (id y estado)
export const fetchDaysByWeekId = async (weekId) => {
  const { data, error } = await supabase
    .from('days')
    .select(`
      *,
      habits (id, is_done)
    `)
    .eq('week_id', weekId)
    .order('date', { ascending: true })

  return { data, error }
}

// Funcion para actualizar el estado de completado de un día
export const updateDayCompletion = async (dayId, newStatus) => {
  const { error } = await supabase
    .from('days')
    .update({ is_completed: newStatus })
    .eq('id', dayId)
  
  return { error }
}

// Funcion para obtener la información de un día específico por su ID
export const fetchDayById = async (dayId) => {
  const { data, error } = await supabase
    .from('days')
    .select('*')
    .eq('id', dayId)
    .single()

  return { data, error }
}


// CRUD DE HÁBITOS

// Funcion para obtener los hábitos de un día específico ordenados por fecha de creación
export const fetchHabitsByDayId = async (dayId) => {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('day_id', dayId)
    .order('created_at', { ascending: true })
  
  return { data, error }
}

// Funcion para crear un nuevo hábito para un día
export const createHabitService = async (dayId, name) => {
  const { data, error } = await supabase
    .from('habits')
    .insert([{ day_id: dayId, name: name }])
    .select()
    .single()
  
  return { data, error }
}

// Funcion para actualizar el estado (completado/no completado) de un hábito
export const updateHabitStatus = async (habitId, newStatus) => {
  const { error } = await supabase
    .from('habits')
    .update({ is_done: newStatus })
    .eq('id', habitId)
  
  return { error }
}

// Funcion para actualizar el nombre de un hábito
export const updateHabitName = async (habitId, newName) => {
  const { error } = await supabase
    .from('habits')
    .update({ name: newName })
    .eq('id', habitId)
  
  return { error }
}

// Funcion para eliminar un hábito por su ID
export const deleteHabitService = async (habitId) => {
  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', habitId)
  
  return { error }
}
