import chalk, { type ChalkInstance } from 'chalk'

export const colors: Record<
  'success' | 'warning' | 'error' | 'info' | 'dimmed' | 'bold',
  ChalkInstance
> = {
  success: chalk.hex('#77dd77'), // Pastel green
  warning: chalk.hex('#fdfd96'), // Pastel yellow
  error: chalk.hex('#ff6961'), // Pastel red
  info: chalk.hex('#aec6cf'), // Pastel blue
  dimmed: chalk.gray,
  bold: chalk.bold,
}
