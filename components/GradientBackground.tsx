'use client'
import { useEffect, useRef, useState } from 'react'
import { MotionProfiler, MotionConfig } from '../util/Motion'

const GradientMotionConfig: Partial<MotionConfig> = {
  maxJerk: 10000,
  maxAccel: 10000,
  maxVel: 1000,
}

const GradientBackground = () => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const motionProfiler = useRef<{ x: MotionProfiler; y: MotionProfiler }>({
    x: new MotionProfiler(GradientMotionConfig),
    y: new MotionProfiler(GradientMotionConfig),
  })
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const handleMouseMove = (event) => {
      motionProfiler.current.x.setTarget(event.clientX)
      motionProfiler.current.y.setTarget(event.clientY)
    }

    const updatePosition = () => {
      const xState = motionProfiler.current.x.update()
      const yState = motionProfiler.current.y.update()
      setPosition({ x: xState.position, y: yState.position })
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
      className="fixed left-0 top-0 -z-10 h-screen w-screen bg-white pl-[calc(100vw-100%)] antialiased dark:bg-gradient-to-r dark:from-gray-950 dark:from-30% dark:to-midnight dark:to-5%"
      style={{
        background: `radial-gradient(circle at ${position.x}px ${position.y}px, var(--tw-gradient-to), var(--tw-gradient-from))`,
      }}
    >
      {process.env.NODE_ENV === 'development' && (
        <div
          className="pointer-events-none fixed"
          style={{
            left: position.x - 1.5,
            top: position.y - 1.5,
            width: '3px',
            height: '3px',
            backgroundColor: 'red',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  )
}

export default GradientBackground
