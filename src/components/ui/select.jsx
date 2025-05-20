"use client"

import { createContext, useContext, useState, useEffect, useRef } from "react"
import { cn } from "../../lib/utils"
import { Check, ChevronDown } from "lucide-react"

const SelectContext = createContext({
  value: "",
  setValue: () => {},
  open: false,
  setOpen: () => {},
})

function Select({ children, value, onValueChange, defaultValue }) {
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || "")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }

  return (
    <SelectContext.Provider value={{ value: selectedValue, setValue: handleValueChange, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  )
}

function SelectTrigger({ children, className, ...props }) {
  const { value, open, setOpen } = useContext(SelectContext)

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

function SelectValue({ placeholder }) {
  const { value } = useContext(SelectContext)

  return <span className={cn("flex-grow", !value && "text-muted-foreground")}>{value || placeholder}</span>
}

function SelectContent({ children, className, ...props }) {
  const { open, setOpen } = useContext(SelectContext)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
        className,
      )}
      {...props}
    >
      <div className="max-h-[var(--radix-select-content-available-height)] overflow-auto">{children}</div>
    </div>
  )
}

function SelectItem({ children, value, className, ...props }) {
  const { value: selectedValue, setValue } = useContext(SelectContext)
  const isSelected = selectedValue === value

  return (
    <div
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected ? "bg-accent text-accent-foreground" : "",
        className,
      )}
      onClick={() => setValue(value)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
