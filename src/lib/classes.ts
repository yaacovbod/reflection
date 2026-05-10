export const GRADES = ['ז', 'ח', 'ט', 'י', 'יא', 'יב'] as const
export type Grade = typeof GRADES[number]

export const CLASS_NUMBERS = [1, 2, 3, 4, 5, 6] as const
export type ClassNumber = typeof CLASS_NUMBERS[number]

export function buildClassName(grade: Grade, num: ClassNumber): string {
  return `${grade}${num}`
}

export const ALL_CLASSES: string[] = GRADES.flatMap(g =>
  CLASS_NUMBERS.map(n => buildClassName(g, n))
)
