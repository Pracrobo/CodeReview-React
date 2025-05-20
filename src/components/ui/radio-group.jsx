"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { cn } from "../../lib/utils"
import { Circle } from "lucide-react"

const RadioGroupContext = createContext({
  value: "",
  setValue: () => {},
})

function RadioGroup({ children, value, onValueChange, defaultValue, className, ...props }) {
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || "")

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <RadioGroupContext.Provider value={{ value: selectedValue, setValue: handleValueChange }}>
      <div className={cn("flex flex-col gap-2", className)} role="radiogroup" {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

function RadioGroupItem({ children, value, className, disabled, ...props }) {
  const { value: selectedValue, setValue } = useContext(RadioGroupContext)
  const isSelected = selectedValue === value

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      disabled={disabled}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        isSelected ? "bg-primary text-primary-foreground" : "bg-background",
        className,
      )}
      onClick={() => !disabled && setValue(value)}
      {...props}
    >
      {isSelected && <Circle className="h-2.5 w-2.5 fill-current text-current" />}
    </button>
  )
}

function RadioGroupItemWithLabel({ value, label, className, disabled, ...props }) {
  const { value: selectedValue, setValue } = useContext(RadioGroupContext)
  const isSelected = selectedValue === value
  const id = `radio-${value}`

  return (
    <div className="flex items-center space-x-2">
      <button
        id={id}
        type="button"
        role="radio"
        aria-checked={isSelected}
        disabled={disabled}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isSelected ? "bg-primary text-primary-foreground" : "bg-background",
          className,
        )}
        onClick={() => !disabled && setValue(value)}
        {...props}
      >
        {isSelected && <Circle className="h-2.5 w-2.5 fill-current text-current" />}
      </button>
      <label
        htmlFor={id}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer",
        )}
        onClick={() => !disabled && setValue(value)}
      >
        {label}
      </label>
    </div>
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupItemWithLabel }
