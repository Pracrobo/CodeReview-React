"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "../../lib/utils"

function Tooltip({ children, content, delayDuration = 700, className, ...props }) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef(null)
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)

  const showTooltip = () => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setOpen(true)
    }, delayDuration)
  }

  const hideTooltip = () => {
    clearTimeout(timeoutRef.current)
    setOpen(false)
  }

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="relative inline-block" onMouseEnter={showTooltip} onMouseLeave={hideTooltip} ref={triggerRef}>
      {children}
      {open && (
        <div
          ref={tooltipRef}
          className={cn(
            "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2",
            className,
          )}
          {...props}
        >
          {content}
        </div>
      )}
    </div>
  )
}

export { Tooltip }
