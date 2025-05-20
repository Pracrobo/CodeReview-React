"use client"

import React, { createContext, useContext, useId } from "react"
import { cn } from "../../lib/utils"
import { Label } from "./label"

const FormContext = createContext({})

function Form({ children, className, ...props }) {
  return (
    <form className={cn("space-y-6", className)} {...props}>
      {children}
    </form>
  )
}

const FormFieldContext = createContext({})

function FormField({ children, name, ...props }) {
  const id = useId()

  return (
    <FormFieldContext.Provider value={{ name, id, ...props }}>
      <div className="space-y-2">{children}</div>
    </FormFieldContext.Provider>
  )
}

function FormLabel({ className, ...props }) {
  const { id } = useContext(FormFieldContext)

  return <Label htmlFor={id} className={cn("text-sm font-medium", className)} {...props} />
}

function FormControl({ children, className, ...props }) {
  const { id } = useContext(FormFieldContext)

  return React.cloneElement(children, {
    id,
    className: cn("", className, children.props.className),
    ...props,
  })
}

function FormDescription({ className, ...props }) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

function FormMessage({ className, children, ...props }) {
  return (
    <p className={cn("text-sm font-medium text-destructive", className)} {...props}>
      {children}
    </p>
  )
}

export { Form, FormField, FormLabel, FormControl, FormDescription, FormMessage }
