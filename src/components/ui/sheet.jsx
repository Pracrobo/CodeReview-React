"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

const SheetContext = createContext({
  open: false,
  setOpen: () => {},
})

function Sheet({ children, open, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(open || false)

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleOpenChange = (value) => {
    setIsOpen(value)
    onOpenChange?.(value)
  }

  return <SheetContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>{children}</SheetContext.Provider>
}

function SheetTrigger({ children, asChild, ...props }) {
  const { setOpen } = useContext(SheetContext)

  if (asChild) {
    return React.cloneElement(children, {
      onClick: (e) => {
        e.preventDefault()
        setOpen(true)
        children.props.onClick?.(e)
      },
      ...props,
    })
  }

  return (
    <button onClick={() => setOpen(true)} {...props}>
      {children}
    </button>
  )
}

function SheetPortal({ children, className, ...props }) {
  const { open } = useContext(SheetContext)

  if (!open) return null

  return (
    <div className={cn("fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm", className)} {...props}>
      {children}
    </div>
  )
}

function SheetOverlay({ className, ...props }) {
  return <div className={cn("absolute inset-0", className)} {...props} />
}

function SheetContent({ children, side = "right", className, ...props }) {
  const { setOpen } = useContext(SheetContext)
  const ref = React.useRef(null)

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setOpen])

  return (
    <div
      ref={ref}
      className={cn(
        "fixed z-50 h-full border bg-background p-6 shadow-lg",
        side === "left" && "left-0 animate-in slide-in-from-left",
        side === "right" && "right-0 animate-in slide-in-from-right",
        side === "top" && "top-0 animate-in slide-in-from-top w-full",
        side === "bottom" && "bottom-0 animate-in slide-in-from-bottom w-full",
        className,
      )}
      {...props}
    >
      {children}
      <button
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        onClick={() => setOpen(false)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

function SheetHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
}

function SheetFooter({ className, ...props }) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
}

function SheetTitle({ className, ...props }) {
  return <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
}

function SheetDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
