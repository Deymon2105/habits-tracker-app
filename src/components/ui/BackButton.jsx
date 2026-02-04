import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@heroui/react'
import { ChevronLeft } from 'lucide-react'

export default function BackButton({ to, onClick }) {
  const navigate = useNavigate()

  const handlePress = () => {
    if (onClick) {
      onClick()
    } else if (to) {
      navigate(to)
    } else {
      navigate(-1)
    }
  }

  return (
    <Button isIconOnly variant="light" onPress={handlePress} aria-label="Volver">
      <ChevronLeft size={24} />
    </Button>
  )
}
