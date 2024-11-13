interface MotionConfig {
  maxJerk: number // Maximum jerk in units/s³
  maxAccel: number // Maximum acceleration in units/s²
  maxVel: number // Maximum velocity in units/s
  tolerance: number // Position error tolerance
}

interface MotionState {
  position: number
  velocity: number
  acceleration: number
  error: number
}

interface SystemState {
  position: number
  velocity: number
  acceleration: number
  target: number
}

class MotionProfiler {
  private readonly maxJerk: number
  private readonly maxAccel: number
  private readonly maxVel: number
  private readonly tolerance: number

  private position: number
  private velocity: number
  private acceleration: number
  private targetPosition: number
  private lastUpdateTime: number

  constructor(config: Partial<MotionConfig> = {}) {
    // Configuration with defaults
    this.maxJerk = config.maxJerk ?? 1000 // units/s³
    this.maxAccel = config.maxAccel ?? 100 // units/s²
    this.maxVel = config.maxVel ?? 10 // units/s
    this.tolerance = config.tolerance ?? 0.1 // units

    // Initialize state
    this.position = 0
    this.velocity = 0
    this.acceleration = 0
    this.targetPosition = 0
    this.lastUpdateTime = performance.now()
  }

  public setTarget(newTarget: number): void {
    this.targetPosition = newTarget
  }

  public update(): MotionState {
    // Calculate position error
    const error = this.targetPosition - this.position

    // if within tolerance, and you are able to stop in time, stop and set position to target

    if (
      Math.abs(error) < this.tolerance &&
      Math.abs(this.velocity) < Math.sqrt(2 * this.maxAccel * this.tolerance)
    ) {
      this.position = this.targetPosition
      this.velocity = 0
      this.acceleration = 0
      return {
        position: this.position,
        velocity: this.velocity,
        acceleration: this.acceleration,
        error: error,
      }
    }

    const currentTime = performance.now()
    const dt = (currentTime - this.lastUpdateTime) / 1000 // Convert to seconds
    this.lastUpdateTime = currentTime

    // Calculate desired acceleration based on error and current velocity
    const desiredAccel = this.calculateDesiredAcceleration(error)

    // Apply jerk limits to acceleration change
    const accelChange = this.limitValue(
      desiredAccel - this.acceleration,
      -this.maxJerk * dt,
      this.maxJerk * dt
    )

    // Update acceleration with jerk limit
    this.acceleration = this.acceleration + accelChange

    // Apply acceleration limits
    this.acceleration = this.limitValue(this.acceleration, -this.maxAccel, this.maxAccel)

    // Update velocity with acceleration
    this.velocity = this.velocity + this.acceleration * dt

    // Apply velocity limits
    this.velocity = this.limitValue(this.velocity, -this.maxVel, this.maxVel)

    // Update position
    this.position = this.position + this.velocity * dt

    return {
      position: this.position,
      velocity: this.velocity,
      acceleration: this.acceleration,
      error: error,
    }
  }

  private calculateDesiredAcceleration(error: number): number {
    // Simple proportional-derivative control
    const kp = 5.0 // Position error gain
    const kv = 2.0 // Velocity damping

    return kp * error - kv * this.velocity
  }

  private limitValue(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
  }

  public getState(): SystemState {
    return {
      position: this.position,
      velocity: this.velocity,
      acceleration: this.acceleration,
      target: this.targetPosition,
    }
  }
}

export { MotionProfiler }
export type { MotionConfig, MotionState, SystemState }
