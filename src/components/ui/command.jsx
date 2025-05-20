"use client"

import { createContext, useContext, useState, useEffect, useRef } from "react"
import { cn } from "../../lib/utils"
import { Search } from "lucide-react"

const CommandContext = createContext({
  open: false,
  setOpen: () => {},
  search: "",
  setSearch: () => {},
})

function Command({ children, className, ...props }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <CommandContext.Provider value={{ open, setOpen, search, setSearch }}>
      <div className={cn("relative", className)} {...props}>
        {children}
      </div>
    </CommandContext.Provider>
  )
}

function CommandInput({ className, ...props }) {
  const { search, setSearch } = useContext(CommandContext)

  return (
    <div className="flex items-center border-b px-3">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        {...props}
      />
    </div>
  )
}

function CommandList({ children, className, ...props }) {
  return (
    <div className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)} {...props}>
      {children}
    </div>
  )
}

function CommandEmpty({ className, ...props }) {
  const { search } = useContext(CommandContext)

  if (!search) return null

  return <div className={cn("py-6 text-center text-sm", className)} {...props} />
}

function CommandGroup({ heading, children, className, ...props }) {
  return (
    <div className={cn("overflow-hidden p-1 text-foreground", className)} {...props}>
      {heading && <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{heading}</div>}
      {children}
    </div>
  )
}

function CommandItem({ children, className, onSelect, ...props }) {
  const { setOpen } = useContext(CommandContext)

  const handleSelect = () => {
    if (onSelect) {
      onSelect()
    }
    setOpen(false)
  }

  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      onClick={handleSelect}
      {...props}
    >
      {children}
    </div>
  )
}

function CommandSeparator({ className, ...props }) {
  return <div className={cn("-mx-1 h-px bg-border", className)} {...props} />
}

function CommandDialog({ children, className, ...props }) {
  const { open, setOpen } = useContext(CommandContext)
  const ref = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }

    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-lg overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandDialog }
