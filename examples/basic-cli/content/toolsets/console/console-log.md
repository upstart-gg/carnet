# console-log

Output text to the console.

## Overview
This tool allows you to display messages and information to the console output.

## Parameters
- `message` (string) - The text to display
- `level` (optional) - The log level: 'info', 'warn', 'error'

## Examples

### Basic logging
```
console-log({ message: "Hello, world!" })
```

### Warning message
```
console-log({ message: "This is a warning", level: "warn" })
```

### Error message
```
console-log({ message: "An error occurred", level: "error" })
```