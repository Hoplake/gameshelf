import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formats [min, max] as a single number when equal (e.g. [2,2] → "2"), otherwise "min-max". */
export function formatPlayerCountRange([min, max]: [number, number]): string {
  return min === max ? String(min) : `${min}-${max}`
}
