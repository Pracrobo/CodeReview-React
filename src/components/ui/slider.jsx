"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"

const Slider = React.forwardRef(
  ({ className, min = 0, max = 100, step = 1, defaultValue, value, onValueChange, ...props }, ref) => {
    const [sliderValue, setSliderValue] = useState(value || defaultValue || min)
    const sliderRef = useRef(null)

    useEffect(() => {
      if (value !== undefined) {
        setSliderValue(value)
      }
    }, [value])

    const handleChange = (event) => {
      const newValue = Number(event.target.value)
      setSliderValue(newValue)
      onValueChange?.(newValue)
    }

    const percentage = ((sliderValue - min) / (max - min)) * 100

    return (
      <div ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)} {...props}>
        <div className="relative w-full h-2 rounded-full bg-secondary overflow-hidden">
          <div className="absolute h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
        </div>
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={sliderValue}
          onChange={handleChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
      </div>
    )
  },
)

Slider.displayName = "Slider"

export { Slider }
