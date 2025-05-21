"use client"

import React, { createContext, useContext, useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"

const DropdownMenuContext = createContext({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
})

const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)

  return <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>{children}</DropdownMenuContext.Provider>
}

const DropdownMenuTrigger = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const { open, setOpen, triggerRef } = useContext(DropdownMenuContext)

  const combinedRef = (node) => {
    if (ref) {
      if (typeof ref === "function") ref(node)
      else ref.current = node
    }
    triggerRef.current = node
  }

  if (asChild) {
    const { children, ...restProps } = props
    return React.cloneElement(children, {
      ref: combinedRef,
      onClick: (e) => {
        children.props.onClick?.(e)
        setOpen(!open)
      },
      ...restProps,
    })
  }

  return <button ref={combinedRef} className={cn("", className)} onClick={() => setOpen(!open)} {...props} />
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef(({ className, align = "center", ...props }, ref) => {
  const { open, setOpen, triggerRef } = useContext(DropdownMenuContext)
  const contentRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        open &&
        contentRef.current &&
        !contentRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={(node) => {
        if (ref) {
          if (typeof ref === "function") ref(node)
          else ref.current = node
        }
        contentRef.current = node
      }}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        align === "end" ? "origin-top-right right-0" : "origin-top-left left-0",
        className,
      )}
      style={{ position: "absolute", top: "100%", marginTop: "8px" }}
      {...props}
    />
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left",
      className,
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
