"use client"

import React, { forwardRef } from "react"
import { cn } from "../../lib/utils"
import { Check } from "lucide-react"

const Checkbox = forwardRef(({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked || false)

  React.useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked)
    }
  }, [checked])

  const handleChange = () => {
    if (disabled) return

    const newValue = !isChecked
    setIsChecked(newValue)
    onCheckedChange?.(newValue)
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      data-state={isChecked ? "checked" : "unchecked"}
      disabled={disabled}
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        isChecked ? "bg-primary text-primary-foreground" : "bg-background",
        className,
      )}
      onClick={handleChange}
      {...props}
    >
      {isChecked && <Check className="h-3 w-3 text-current" />}
    </button>
  )
})

Checkbox.displayName = "Checkbox"

export { Checkbox }
