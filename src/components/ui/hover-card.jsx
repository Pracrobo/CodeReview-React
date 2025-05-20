"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"

function HoverCard({ children, className, ...props }) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}

function HoverCardTrigger({ children, asChild, ...props }) {
  return asChild ? React.cloneElement(children, props) : <span {...props}>{children}</span>
}

function HoverCardContent({ children, className, align = "center", sideOffset = 4, ...props }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const contentRef = useRef(null)
  const timeoutRef = useRef(null)

  const showCard = () => {
    clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const hideCard = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false)
    }, 300)
  }

  useEffect(() => {
    const trigger = triggerRef.current
    const content = contentRef.current

    if (!trigger || !content) return

    trigger.addEventListener("mouseenter", showCard)
    trigger.addEventListener("mouseleave", hideCard)
    content.addEventListener("mouseenter", showCard)
    content.addEventListener("mouseleave", hideCard)

    return () => {
      trigger.removeEventListener("mouseenter", showCard)
      trigger.removeEventListener("mouseleave", hideCard)
      content.removeEventListener("mouseenter", showCard)
      content.removeEventListener("mouseleave", hideCard)
      clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!open) return null

  return (
    <div
      ref={contentRef}
      className={cn(
        "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95",
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

export { HoverCard, HoverCardTrigger, HoverCardContent }
