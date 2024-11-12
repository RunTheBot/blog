'use client'
import { useEffect, useRef, useState } from 'react'

const GradientBackground = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const velocityRef = useRef({ x: 0, y: 0 })
  const targetPositionRef = useRef({ x: 0, y: 0 })
  const currentPositionRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef()

  useEffect(() => {
    const handleMouseMove = (event) => {
      targetPositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      }
    }

    const updatePosition = () => {
      // Motion profiling constants
      const stiffness = 0.1 // Spring stiffness
      const damping = 0.8 // Damping factor
      const maxVelocity = 15 // Maximum speed
      const threshold = 0.1 // Minimum movement threshold
      const maxAccel = 1 // Maximum acceleration

      // Calculate distance to target (spring force)
      const deltaX = targetPositionRef.current.x - currentPositionRef.current.x
      const deltaY = targetPositionRef.current.y - currentPositionRef.current.y

      // Calculate spring-based acceleration with damping
      const accelX = deltaX * stiffness - velocityRef.current.x * damping
      const accelY = deltaY * stiffness - velocityRef.current.y * damping

      // Limit acceleration
      const accelMagnitude = Math.sqrt(accelX ** 2 + accelY ** 2)
      const accelScale = accelMagnitude > maxAccel ? maxAccel / accelMagnitude : 1

      // Apply acceleration to velocity
      velocityRef.current.x += accelX * accelScale
      velocityRef.current.y += accelY * accelScale

      // Limit maximum velocity
      const currentVelocity = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2)

      if (currentVelocity > maxVelocity) {
        const scale = maxVelocity / currentVelocity
        velocityRef.current.x *= scale
        velocityRef.current.y *= scale
      }

      // Update position
      currentPositionRef.current.x += velocityRef.current.x
      currentPositionRef.current.y += velocityRef.current.y

      // Stop movement if changes are very small
      if (
        Math.abs(deltaX) < threshold &&
        Math.abs(deltaY) < threshold &&
        Math.abs(velocityRef.current.x) < threshold &&
        Math.abs(velocityRef.current.y) < threshold
      ) {
        velocityRef.current.x = 0
        velocityRef.current.y = 0
        currentPositionRef.current.x = targetPositionRef.current.x
        currentPositionRef.current.y = targetPositionRef.current.y
      }

      // Update state
      setPosition({
        x: currentPositionRef.current.x,
        y: currentPositionRef.current.y,
      })

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(updatePosition)
    }

    // Start animation loop
    updatePosition()

    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
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
