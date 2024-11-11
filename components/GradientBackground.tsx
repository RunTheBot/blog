'use client'
import { useEffect, useState } from 'react'

const GradientBackground = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      className="fixed left-0 top-0 -z-10 h-screen w-screen bg-white pl-[calc(100vw-100%)] antialiased dark:bg-gradient-to-r dark:from-gray-950 dark:to-midnight"
      style={{
        background: `radial-gradient(circle at ${position.x}px ${position.y}px, var(--tw-gradient-to), var(--tw-gradient-from)`,
      }}
    ></div>
  )
}

export default GradientBackground
