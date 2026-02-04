import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchDayById, fetchHabitsByDayId, createHabitService, updateHabitStatus, deleteHabitService, updateHabitName } from '../services/api'
import { Button, Input, Checkbox, Progress, Card, CardBody } from '@heroui/react'
import { Trash2, Edit2, Plus, CheckCircle2 } from 'lucide-react'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import BackButton from '../components/ui/BackButton'

export default function DayView() {
  const { dayId } = useParams()
  const navigate = useNavigate()
  const [day, setDay] = useState(null)
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [newHabit, setNewHabit] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  
  // Estado para editar un hábito
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')

  // Hook para cargar los datos del día al montar el componente
  useEffect(() => {
    loadDayData()
  }, [dayId])

  // Función para cargar los datos del día desde api.js
  const loadDayData = async () => {
    try {
      setLoading(true)
      const { data: dayData } = await fetchDayById(dayId)
      setDay(dayData)

      const { data: habitsData } = await fetchHabitsByDayId(dayId)
      setHabits(habitsData || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Función para agregar un nuevo hábito
  const addHabit = async (e) => {
    e.preventDefault()
    if (!newHabit.trim()) return

    setAddLoading(true)
    const { data, error } = await createHabitService(dayId, newHabit)

    if (!error) {
      setHabits([...habits, data])
      setNewHabit('')
    }
    setAddLoading(false)
  }

  // Función para cambiar el estado de un hábito
  const toggleHabit = async (habitId, currentStatus) => {
    const updatedHabits = habits.map(h => 
      h.id === habitId ? { ...h, is_done: !currentStatus } : h
    )
    setHabits(updatedHabits)

    await updateHabitStatus(habitId, !currentStatus)
  }

  // Función para eliminar un hábito
  const deleteHabit = async (habitId) => {
    if (!confirm('¿Estás seguro de eliminar este hábito?')) return
    
    setHabits(habits.filter(h => h.id !== habitId))
    await deleteHabitService(habitId)
  }

  // Función para iniciar la edición de un hábito
  const startEditing = (habit) => {
    setEditingId(habit.id)
    setEditingText(habit.name)
  }

  // Función para guardar la edición de un hábito
  const saveEdit = async () => {
    if (!editingText.trim()) return
    
    setHabits(habits.map(h => h.id === editingId ? { ...h, name: editingText } : h))
    setEditingId(null)
    
    await updateHabitName(editingId, editingText)
  }

  // Función para cancelar la edición de un hábito
  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  // Estado derivado
  const totalHabits = habits.length
  const completedHabits = habits.filter(h => h.is_done).length
  const progress = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-zoom-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {day && (() => {
              const [y, m, d] = day.date.split('-').map(Number)
              const localDate = new Date(y, m - 1, d)
              return localDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
            })()}
            {progress === 100 && totalHabits > 0 && <CheckCircle2 className="text-green-500 animate-bounce" />}
          </h1>
          <p className="text-default-500">Gestiona tus tareas diarias</p>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="shadow-sm border-none bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-content1 dark:to-content2">
        <CardBody className="p-6">
          <div className="flex justify-between mb-2 font-semibold text-foreground">
            <span>Progreso Diario</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress 
            size="lg" 
            value={progress} 
            color={progress === 100 ? "success" : "primary"}
            className="w-full"
            classNames={{
              indicator: "transition-all duration-500 ease-out"
            }}
          />
          <div className="text-right mt-2 text-sm text-default-500">
            {completedHabits}/{totalHabits} completados
          </div>
        </CardBody>
      </Card>

      {/* Add Habit */}
      <form onSubmit={addHabit} className="flex gap-2">
        <Input 
          placeholder="Escribe un nuevo hábito..." 
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          className="flex-grow"
          size="lg"
          startContent={<Plus className="text-default-400" />}
        />
        <Button type="submit" color="primary" size="lg" isLoading={addLoading} isIconOnly={false}>
          Añadir
        </Button>
      </form>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <Card key={habit.id} className="group hover:shadow-md transition-shadow">
            <CardBody className="flex flex-row items-center gap-4 py-3">
              <Checkbox 
                isSelected={habit.is_done} 
                onValueChange={() => toggleHabit(habit.id, habit.is_done)}
                color="success"
                size="lg"
                lineThrough
              />
              
              <div className="flex-grow">
                {editingId === habit.id ? (
                  <div className="flex gap-2">
                    <Input 
                      value={editingText} 
                      onChange={(e) => setEditingText(e.target.value)} 
                      size="sm" 
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    />
                    <Button size="sm" color="success" isIconOnly onPress={saveEdit}>OK</Button>
                    <Button size="sm" color="danger" isIconOnly variant="flat" onPress={cancelEdit}>X</Button>
                  </div>
                ) : (
                  <span className={`text-lg ${habit.is_done ? 'text-default-400 line-through' : 'text-foreground'}`}>
                    {habit.name}
                  </span>
                )}
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId !== habit.id && (
                  <>
                    <Button isIconOnly size="sm" variant="light" onPress={() => startEditing(habit)}>
                      <Edit2 size={18} className="text-default-600" />
                    </Button>
                    <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => deleteHabit(habit.id)}>
                      <Trash2 size={18} />
                    </Button>
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        ))}

        {habits.length === 0 && (
          <div className="text-center py-12 text-default-400 border-2 border-dashed rounded-xl">
             No hay hábitos para este día. ¡Añade uno arriba!
          </div>
        )}
      </div>
    </div>
  )
}
