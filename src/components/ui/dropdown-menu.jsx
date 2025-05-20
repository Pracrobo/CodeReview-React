"use client"

import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils"

const DropdownMenuContext = createContext({})

function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false)

  return <DropdownMenuContext.Provider value={{ open, setOpen }}>{children}</DropdownMenuContext.Provider>
}

function DropdownMenuTrigger({ children, asChild, ...props }) {
  const { open, setOpen } = useContext(DropdownMenuContext)

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

function DropdownMenuContent({ children, align = "center", className, ...props }) {
  const { open, setOpen } = useContext(DropdownMenuContext)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        align === "end" ? "origin-top-right right-0" : "origin-top-left left-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function DropdownMenuItem({ className, children, ...props }) {
  const { setOpen } = useContext(DropdownMenuContext)

  return (
    <button
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left",
        className,
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  )
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
