"use client"

import { createContext, useContext, useState } from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "lucide-react"

const AccordionContext = createContext({
  value: null,
  setValue: () => {},
  type: "single", // or "multiple"
})

function Accordion({ children, type = "single", value, onValueChange, defaultValue, className, ...props }) {
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || (type === "multiple" ? [] : null))

  const handleValueChange = (itemValue) => {
    let newValue

    if (type === "multiple") {
      newValue = selectedValue.includes(itemValue)
        ? selectedValue.filter((v) => v !== itemValue)
        : [...selectedValue, itemValue]
    } else {
      newValue = selectedValue === itemValue ? null : itemValue
    }

    setSelectedValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <AccordionContext.Provider value={{ value: selectedValue, setValue: handleValueChange, type }}>
      <div className={cn("space-y-1", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

function AccordionItem({ children, value, className, ...props }) {
  const { value: selectedValue, type } = useContext(AccordionContext)
  const isOpen = type === "multiple" ? selectedValue?.includes(value) : selectedValue === value

  return (
    <div className={cn("border-b", className)} data-state={isOpen ? "open" : "closed"} {...props}>
      {children}
    </div>
  )
}

function AccordionTrigger({ children, className, ...props }) {
  const { value: selectedValue, setValue, type } = useContext(AccordionContext)
  const itemValue = props["data-value"]
  const isOpen = type === "multiple" ? selectedValue?.includes(itemValue) : selectedValue === itemValue

  return (
    <button
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      onClick={() => setValue(itemValue)}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  )
}

function AccordionContent({ children, className, ...props }) {
  const { value: selectedValue, type } = useContext(AccordionContext)
  const itemValue = props["data-value"]
  const isOpen = type === "multiple" ? selectedValue?.includes(itemValue) : selectedValue === itemValue

  return isOpen ? (
    <div
      className={cn(
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className,
      )}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  ) : null
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
