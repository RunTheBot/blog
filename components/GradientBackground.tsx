'use client'
import { useEffect, useRef, useState } from 'react'

const GradientBackground = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const velocityRef = useRef({ x: 0, y: 0 })
  const accelerationRef = useRef({ x: 0, y: 0 })
  const targetPositionRef = useRef({ x: 0, y: 0 })
  const currentPositionRef = useRef({ x: 0, y: 0 })
  const prevDeltaRef = useRef({ x: 0, y: 0 })
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
      const baseAcceleration = 0.1 // Base acceleration rate
      const maxVelocity = 20 // Maximum speed
      const friction = 0.85 // Slows down movement (0-1)
      const threshold = 0.1 // Minimum movement threshold
      const maxJerk = 1 // Maximum rate of acceleration change

      // Calculate distance to target
      const deltaX = targetPositionRef.current.x - currentPositionRef.current.x
      const deltaY = targetPositionRef.current.y - currentPositionRef.current.y

      // Calculate desired acceleration
      const desiredAccelX = deltaX * baseAcceleration
      const desiredAccelY = deltaY * baseAcceleration

      // Limit jerk (rate of acceleration change)
      const accelChangeX = desiredAccelX - accelerationRef.current.x
      const accelChangeY = desiredAccelY - accelerationRef.current.y

      // Apply jerk limitation
      const jerkMagnitude = Math.sqrt(accelChangeX ** 2 + accelChangeY ** 2)
      if (jerkMagnitude > maxJerk) {
        const scale = maxJerk / jerkMagnitude
        accelerationRef.current.x += accelChangeX * scale
        accelerationRef.current.y += accelChangeY * scale
      } else {
        accelerationRef.current.x = desiredAccelX
        accelerationRef.current.y = desiredAccelY
      }

      // Apply acceleration to velocity
      velocityRef.current.x += accelerationRef.current.x
      velocityRef.current.y += accelerationRef.current.y

      // Apply friction
      velocityRef.current.x *= friction
      velocityRef.current.y *= friction

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

      // Store current delta for next frame
      prevDeltaRef.current = { x: deltaX, y: deltaY }

      // Update state only if movement is significant
      if (
        Math.abs(velocityRef.current.x) > threshold ||
        Math.abs(velocityRef.current.y) > threshold
      ) {
        setPosition({
          x: currentPositionRef.current.x,
          y: currentPositionRef.current.y,
        })
      }

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
