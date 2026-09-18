"use client"

import { useState, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"

type Operator = "+" | "-" | "×" | "÷"

export function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previous, setPrevious] = useState<number | null>(null)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputDigit = useCallback(
    (digit: string) => {
      if (waitingForOperand) {
        setDisplay(digit)
        setWaitingForOperand(false)
      } else {
        setDisplay((prev) => (prev === "0" ? digit : prev + digit))
      }
    },
    [waitingForOperand],
  )

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
      return
    }
    setDisplay((prev) => (prev.includes(".") ? prev : prev + "."))
  }, [waitingForOperand])

  const clearAll = useCallback(() => {
    setDisplay("0")
    setPrevious(null)
    setOperator(null)
    setWaitingForOperand(false)
  }, [])

  const toggleSign = useCallback(() => {
    setDisplay((prev) => (prev.startsWith("-") ? prev.slice(1) : prev === "0" ? prev : "-" + prev))
  }, [])

  const inputPercent = useCallback(() => {
    setDisplay((prev) => String(Number.parseFloat(prev) / 100))
  }, [])

  const compute = useCallback((a: number, b: number, op: Operator): number => {
    switch (op) {
      case "+":
        return a + b
      case "-":
        return a - b
      case "×":
        return a * b
      case "÷":
        return b === 0 ? Number.NaN : a / b
    }
  }, [])

  const performOperation = useCallback(
    (nextOperator: Operator) => {
      const inputValue = Number.parseFloat(display)

      if (previous === null) {
        setPrevious(inputValue)
      } else if (operator) {
        const result = compute(previous, inputValue, operator)
        setDisplay(String(result))
        setPrevious(result)
      }

      setWaitingForOperand(true)
      setOperator(nextOperator)
    },
    [display, previous, operator, compute],
  )

  const equals = useCallback(() => {
    if (operator === null || previous === null) return
    const inputValue = Number.parseFloat(display)
    const result = compute(previous, inputValue, operator)
    setDisplay(String(result))
    setPrevious(null)
    setOperator(null)
    setWaitingForOperand(true)
  }, [operator, previous, display, compute])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") inputDigit(e.key)
      else if (e.key === ".") inputDecimal()
      else if (e.key === "+") performOperation("+")
      else if (e.key === "-") performOperation("-")
      else if (e.key === "*") performOperation("×")
      else if (e.key === "/") {
        e.preventDefault()
        performOperation("÷")
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault()
        equals()
      } else if (e.key === "Escape") clearAll()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [inputDigit, inputDecimal, performOperation, equals, clearAll])

  const buttons: {
    label: string
    onClick: () => void
    variant?: "default" | "accent" | "muted"
    span?: boolean
    active?: boolean
  }[] = [
    { label: "AC", onClick: clearAll, variant: "muted" },
    { label: "+/-", onClick: toggleSign, variant: "muted" },
    { label: "%", onClick: inputPercent, variant: "muted" },
    { label: "÷", onClick: () => performOperation("÷"), variant: "accent", active: operator === "÷" },
    { label: "7", onClick: () => inputDigit("7") },
    { label: "8", onClick: () => inputDigit("8") },
    { label: "9", onClick: () => inputDigit("9") },
    { label: "×", onClick: () => performOperation("×"), variant: "accent", active: operator === "×" },
    { label: "4", onClick: () => inputDigit("4") },
    { label: "5", onClick: () => inputDigit("5") },
    { label: "6", onClick: () => inputDigit("6") },
    { label: "-", onClick: () => performOperation("-"), variant: "accent", active: operator === "-" },
    { label: "1", onClick: () => inputDigit("1") },
    { label: "2", onClick: () => inputDigit("2") },
    { label: "3", onClick: () => inputDigit("3") },
    { label: "+", onClick: () => performOperation("+"), variant: "accent", active: operator === "+" },
    { label: "0", onClick: () => inputDigit("0"), span: true },
    { label: ".", onClick: inputDecimal },
    { label: "=", onClick: equals, variant: "accent" },
  ]

  return (
    <div className="w-full max-w-xs rounded-3xl bg-card p-4 shadow-lg ring-1 ring-border">
      <div
        aria-live="polite"
        className="mb-4 flex min-h-24 items-end justify-end overflow-x-auto rounded-2xl bg-muted px-4 py-6"
      >
        <span className="text-right font-mono text-5xl font-light tracking-tight text-foreground tabular-nums">
          {display === "NaN" ? "Error" : display}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={cn(
              "flex h-16 items-center justify-center rounded-2xl text-xl font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
              btn.span && "col-span-2",
              btn.variant === "accent" && "bg-primary text-primary-foreground hover:opacity-90",
              btn.variant === "muted" && "bg-secondary text-secondary-foreground hover:opacity-80",
              (!btn.variant || btn.variant === "default") &&
                "bg-muted text-foreground hover:bg-muted/70",
              btn.active && "ring-2 ring-foreground",
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}
