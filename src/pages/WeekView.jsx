import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardBody, Button, Progress } from '@heroui/react'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import BackButton from '../components/ui/BackButton'
import { fetchWeekById, fetchDaysByWeekId } from '../services/api'

export default function WeekView() {
  const { weekId } = useParams()
  const navigate = useNavigate()
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)
  const [weekInfo, setWeekInfo] = useState(null)

  // Hook para cargar los datos de la semana al cargar el componente
  useEffect(() => {
    loadWeekData()
  }, [weekId])

  // Funcion para cargar los datos de la semana desde api.js
  const loadWeekData = async () => {
    try {
      setLoading(true)
      // Obtener información de la semana
      const { data: week } = await fetchWeekById(weekId)
      setWeekInfo(week)

      // Obtener los días de la semana
      const { data: daysData } = await fetchDaysByWeekId(weekId)

      setDays(daysData || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Funcion para obtener el nombre del día
  // Parsear como fecha local para evitar problemas de zona horaria
  const getDayName = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number)
    const localDate = new Date(y, m - 1, d)
    return new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(localDate)
  }
  
  // Funcion para calcular el progreso de un día
  const calculateProgress = (day) => {
     if (!day.habits || day.habits.length === 0) return 0
     const completed = day.habits.filter(h => h.is_done).length
     return (completed / day.habits.length) * 100
  }

  // Si está cargando, muestra un spinner
  // Si está cargando, muestra un spinner
  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <BackButton to="/" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">{weekInfo?.name || 'Vista Semanal'}</h1>
          <p className="text-default-500">
             {weekInfo && `${weekInfo.start_date} - ${weekInfo.end_date}`}
          </p>
        </div>
      </div>

      <div className="card-grid-tight">
        {days.map((day) => {
          const progress = calculateProgress(day)
          
          return (
            <Card 
              key={day.id} 
              isPressable 
              onPress={() => navigate(`/day/${day.id}`)}
              className={`border-l-4 ${day.is_completed ? 'border-green-500' : 'border-divider'} hover:shadow-lg transition-all`}
            >
              <CardHeader className="pb-0">
                <div>
                  <h3 className="capitalize font-bold text-lg text-foreground">{getDayName(day.date)}</h3>
                  <p className="text-small text-default-500">{day.date}</p>
                </div>
              </CardHeader>
              <CardBody className="py-4">
                 <div className="flex justify-between text-xs text-default-400 mb-1">
                    <span>Progreso</span>
                    <span>{Math.round(progress)}%</span>
                 </div>
                 <Progress 
                    size="sm" 
                    value={progress} 
                    color={progress === 100 ? "success" : "primary"}
                    className="max-w-md"
                 />
                 <div className="mt-3 text-xs text-center text-default-400">
                    {day.habits?.length || 0} Hábitos
                 </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
