import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Plus, Calendar, ArrowRight, Trash2 } from 'lucide-react'
import { fetchWeeks, createWeekService, deleteWeekService } from '../services/api'

// Helper para formatear la fecha
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-').map(Number)
  const localDate = new Date(year, month - 1, day)
  return localDate.toLocaleDateString('es-ES', { dateStyle: 'medium' })
}

export default function Dashboard() {
  const [weeks, setWeeks] = useState([])
  const [loading, setLoading] = useState(true)
  const [createLoading, setCreateLoading] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  // Manejo de fechas
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  // Estado para modo de eliminación
  const [deleteMode, setDeleteMode] = useState(false)

  // Hook para cargar las semanas al cargar el componente
  useEffect(() => {
    loadWeeks()
  }, [])

  // Funcion para hacer un fetch de las semanas desde api.js
  const loadWeeks = async () => {
    try {
      setLoading(true)
      const { data, error } = await fetchWeeks()
      
      if (error) throw error
      setWeeks(data || [])
    } catch (error) {
      console.error('Error fetching weeks:', error)
    } finally {
      setLoading(false)
    }
  }

  // Funcion para crear una nueva semana desde api.js
  const handleCreateWeek = async (onClose) => {
    if (!startDate) return
    
    try {
      setCreateLoading(true)
      
      const { error } = await createWeekService(startDate, endDate)

      if (error) throw error

      await loadWeeks()
      onClose()
      setStartDate('')
      setEndDate('')
    } catch (error) {
      console.error('Error creating week:', error)
      alert('Error creando la semana: ' + error.message)
    } finally {
      setCreateLoading(false)
    }
  }

  // Funcion para eliminar una semana
  const handleDeleteWeek = async (weekId, weekName) => {
    if (!confirm(`¿Estás seguro de eliminar "${weekName}"? Esto eliminará todos los días y hábitos asociados.`)) {
      return
    }
    
    try {
      const { error } = await deleteWeekService(weekId)
      
      if (error) throw error
      
      // Actualizar la lista de semanas
      setWeeks(weeks.filter(w => w.id !== weekId))
      setDeleteMode(false)
    } catch (error) {
      console.error('Error deleting week:', error)
      alert('Error eliminando la semana: ' + error.message)
    }
  }

  return (
    <div className="animate-page-enter space-y-8">
      <div className="page-header-container">
        <h1 className="page-title-gradient-purple">
          Mis Semanas
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onPress={() => setDeleteMode(!deleteMode)} 
            color={deleteMode ? "default" : "danger"} 
            variant={deleteMode ? "flat" : "light"}
            endContent={<Trash2 size={18} />}
            className="w-full sm:w-auto"
          >
            {deleteMode ? 'Cancelar' : 'Eliminar Semana'}
          </Button>
          <Button onPress={onOpen} color="primary" endContent={<Plus />} className="w-full sm:w-auto">
            Nueva Semana
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card-grid">
          {weeks.map((week) => (
            <Card key={week.id} className={deleteMode ? "" : "card-actionable"} pressable={!deleteMode}>
              {deleteMode ? (
                <>
                  <CardHeader className="flex gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Calendar size={24} />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <p className="text-md font-bold text-foreground">{week.name}</p>
                      <p className="text-small text-default-500">
                        {formatDate(week.start_date)} - {formatDate(week.end_date)}
                      </p>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <p className="text-default-600 text-sm">
                      Gestiona tus hábitos diarios para esta semana
                    </p>
                  </CardBody>
                  <CardFooter className="flex justify-end">
                    <Button 
                      color="danger" 
                      variant="flat"
                      size="sm"
                      onPress={() => handleDeleteWeek(week.id, week.name)}
                      endContent={<Trash2 size={16} />}
                    >
                      Eliminar
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <Link to={`/week/${week.id}`} className="w-full h-full">
                  <CardHeader className="flex gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Calendar size={24} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-md font-bold text-foreground">{week.name}</p>
                      <p className="text-small text-default-500">
                        {formatDate(week.start_date)} - {formatDate(week.end_date)}
                      </p>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <p className="text-default-600 text-sm">
                      Gestiona tus hábitos diarios para esta semana
                    </p>
                  </CardBody>
                  <CardFooter className="flex justify-end">
                     <div className="flex items-center text-primary text-sm font-medium">
                       Ver Detalles <ArrowRight size={16} className="ml-1" />
                     </div>
                  </CardFooter>
                </Link>
              )}
            </Card>
          ))}
          
          {weeks.length === 0 && (
            <div className="col-span-full text-center py-12 text-default-400">
              No tienes semanas creadas. ¡Empieza ahora!
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Crear Nueva Semana</ModalHeader>
              <ModalBody>
                <Input
                  type="date"
                  label="Fecha de Inicio"
                  placeholder="Selecciona fecha"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  isRequired
                />
                <Input
                  type="date"
                  label="Fecha de Fin (Opcional)"
                  placeholder="Selecciona fecha"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  description="Si se deja vacío, se calcularán 7 días automáticamente."
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={() => handleCreateWeek(onClose)} isLoading={createLoading}>
                  Crear Semana
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
