"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"

const DialogContext = createContext({
  open: false,
  setOpen: () => {},
})

function Dialog({ children, open, onOpenChange }) {
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

  return <DialogContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>{children}</DialogContext.Provider>
}

function DialogTrigger({ children, asChild, ...props }) {
  const { setOpen } = useContext(DialogContext)

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

function DialogPortal({ children, className, ...props }) {
  const { open } = useContext(DialogContext)

  if (!open) return null

  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function DialogOverlay({ className, ...props }) {
  return <div className={cn("absolute inset-0", className)} {...props} />
}

function DialogContent({ children, className, ...props }) {
  const { setOpen } = useContext(DialogContext)
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
        "relative bg-background rounded-lg shadow-lg border p-6 w-full max-w-md max-h-[85vh] overflow-auto animate-in fade-in-0 zoom-in-95 duration-200",
        className,
      )}
      {...props}
    >
      {children}
      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogClose>
    </div>
  )
}

function DialogHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
}

function DialogFooter({ className, ...props }) {
  return <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
}

function DialogTitle({ className, ...props }) {
  return <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
}

function DialogDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

function DialogClose({ className, ...props }) {
  const { setOpen } = useContext(DialogContext)

  return <button className={className} onClick={() => setOpen(false)} {...props} />
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
