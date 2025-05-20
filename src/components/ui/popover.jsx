"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from "react"
import { cn } from "../../lib/utils"

const PopoverContext = createContext({
  open: false,
  setOpen: () => {},
})

function Popover({ children, open, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(open || false)

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = (value) => {
    setIsOpen(value)
    onOpenChange?.(value)
  }

  return (
    <PopoverContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>{children}</PopoverContext.Provider>
  )
}

function PopoverTrigger({ children, asChild, ...props }) {
  const { open, setOpen } = useContext(PopoverContext)

  if (asChild) {
    return React.cloneElement(children, {
      onClick: (e) => {
        e.preventDefault()
        setOpen(!open)
        children.props.onClick?.(e)
      },
      ...props,
    })
  }

  return (
    <button onClick={() => setOpen(!open)} {...props}>
      {children}
    </button>
  )
}

function PopoverContent({ children, className, align = "center", sideOffset = 4, ...props }) {
  const { open, setOpen } = useContext(PopoverContext)
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
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        align === "start" && "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        align === "center" && "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        align === "end" && "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      style={{
        position: "absolute",
        top: `calc(100% + ${sideOffset}px)`,
        left: align === "start" ? 0 : align === "end" ? "auto" : "50%",
        right: align === "end" ? 0 : "auto",
        transform: align === "center" ? "translateX(-50%)" : "none",
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
