import React from 'react'
import { Spinner } from '@heroui/react'

export default function LoadingSpinner({ size = "lg", color = "primary", label }) {
  return (
    <div className="flex justify-center items-center py-12">
      <Spinner size={size} color={color} label={label} />
    </div>
  )
}
