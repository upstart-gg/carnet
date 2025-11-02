import { describe, expect, it } from 'bun:test'
import { VariableInjector } from '../../src/lib/variable-injector'

describe('VariableInjector', () => {
  describe('inject', () => {
    it('should inject custom variables', () => {
      const injector = new VariableInjector({
        variables: {
          USER_NAME: 'Alice',
          GREETING: 'Hello',
        },
      })

      const result = injector.inject('{{ GREETING }}, {{ USER_NAME }}!')
      expect(result).toBe('Hello, Alice!')
    })

    it('should handle multiple occurrences of the same variable', () => {
      const injector = new VariableInjector({
        variables: { NAME: 'Bob' },
      })

      const result = injector.inject('{{ NAME }} loves {{ NAME }}')
      expect(result).toBe('Bob loves Bob')
    })

    it('should handle whitespace around variable names', () => {
      const injector = new VariableInjector({
        variables: { VAR: 'value' },
      })

      expect(injector.inject('{{ VAR }}')).toBe('value')
      expect(injector.inject('{{VAR}}')).toBe('value')
      expect(injector.inject('{{  VAR  }}')).toBe('value')
    })

    it('should inject environment variables with allowed prefixes', () => {
      const _originalEnv = process.env
      process.env.CARNET_API_KEY = 'secret123'
      process.env.PUBLIC_URL = 'https://example.com'
      process.env.PRIVATE_KEY = 'should-not-appear'

      const injector = new VariableInjector({
        envPrefixes: ['CARNET_', 'PUBLIC_'],
      })

      const result = injector.inject('Key: {{ CARNET_API_KEY }}, URL: {{ PUBLIC_URL }}')
      expect(result).toBe('Key: secret123, URL: https://example.com')

      delete process.env.CARNET_API_KEY
      delete process.env.PUBLIC_URL
      delete process.env.PRIVATE_KEY
    })

    it('should prioritize custom variables over environment variables', () => {
      process.env.CARNET_ENV = 'env-value'

      const injector = new VariableInjector({
        variables: { CARNET_ENV: 'custom-value' },
        envPrefixes: ['CARNET_'],
      })

      const result = injector.inject('{{ CARNET_ENV }}')
      expect(result).toBe('custom-value')

      delete process.env.CARNET_ENV
    })

    it('should accept additional variables in inject call', () => {
      const injector = new VariableInjector({
        variables: { BASE: 'base-value' },
      })

      const result = injector.inject('{{ BASE }} and {{ EXTRA }}', {
        EXTRA: 'extra-value',
      })

      expect(result).toBe('base-value and extra-value')
    })

    it('should prioritize additional variables over constructor variables', () => {
      const injector = new VariableInjector({
        variables: { VAR: 'original' },
      })

      const result = injector.inject('{{ VAR }}', { VAR: 'override' })
      expect(result).toBe('override')
    })

    it('should leave undefined variables unchanged', () => {
      const injector = new VariableInjector({
        variables: { DEFINED: 'value' },
      })

      const result = injector.inject('{{ DEFINED }} and {{ UNDEFINED }}')
      expect(result).toBe('value and {{ UNDEFINED }}')
    })

    it('should not replace invalid variable names', () => {
      const injector = new VariableInjector()

      // Variable names must start with letter or underscore, contain only alphanumerics and underscores
      expect(injector.inject('{{ 123INVALID }}')).toBe('{{ 123INVALID }}')
      expect(injector.inject('{{ INVALID-NAME }}')).toBe('{{ INVALID-NAME }}')
      expect(injector.inject('{{ INVALID.NAME }}')).toBe('{{ INVALID.NAME }}')
    })

    it('should handle multiline content', () => {
      const injector = new VariableInjector({
        variables: {
          TITLE: 'My Title',
          DESC: 'My Description',
        },
      })

      const content = `# {{ TITLE }}

{{ DESC }}

More content here.`

      const result = injector.inject(content)
      expect(result).toContain('# My Title')
      expect(result).toContain('My Description')
    })

    it('should handle empty content', () => {
      const injector = new VariableInjector()
      const result = injector.inject('')
      expect(result).toBe('')
    })

    it('should handle content with no variables', () => {
      const injector = new VariableInjector({
        variables: { VAR: 'value' },
      })

      const content = 'Just regular content with no variables'
      const result = injector.inject(content)
      expect(result).toBe(content)
    })
  })

  describe('hasVariables', () => {
    it('should detect variables in content', () => {
      const injector = new VariableInjector()

      expect(injector.hasVariables('{{ VAR }}')).toBe(true)
      expect(injector.hasVariables('Text with {{ VAR }} inside')).toBe(true)
      expect(injector.hasVariables('{{ VAR1 }} and {{ VAR2 }}')).toBe(true)
    })

    it('should return false for content without variables', () => {
      const injector = new VariableInjector()

      expect(injector.hasVariables('No variables here')).toBe(false)
      expect(injector.hasVariables('{{ 123 }}')).toBe(false)
      expect(injector.hasVariables('')).toBe(false)
    })

    it('should handle whitespace variations', () => {
      const injector = new VariableInjector()

      expect(injector.hasVariables('{{ VAR }}')).toBe(true)
      expect(injector.hasVariables('{{VAR}}')).toBe(true)
      expect(injector.hasVariables('{{  VAR  }}')).toBe(true)
    })
  })

  describe('configuration', () => {
    it('should use default env prefixes when not specified', () => {
      process.env.CARNET_VAR = 'carnet-value'
      process.env.PUBLIC_VAR = 'public-value'

      const injector = new VariableInjector()
      const result = injector.inject('{{ CARNET_VAR }} {{ PUBLIC_VAR }}')

      expect(result).toBe('carnet-value public-value')

      delete process.env.CARNET_VAR
      delete process.env.PUBLIC_VAR
    })

    it('should support custom env prefixes', () => {
      process.env.MYAPP_VAR = 'value1'
      process.env.CARNET_VAR = 'value2'

      const injector = new VariableInjector({
        envPrefixes: ['MYAPP_'],
      })

      const result = injector.inject('{{ MYAPP_VAR }} {{ CARNET_VAR }}')
      // CARNET_VAR should not be injected because it's not in the allowed prefixes
      expect(result).toContain('value1')
      expect(result).toContain('{{ CARNET_VAR }}')

      delete process.env.MYAPP_VAR
      delete process.env.CARNET_VAR
    })

    it('should work with empty custom variables', () => {
      const injector = new VariableInjector({
        variables: {},
      })

      expect(injector.inject('{{ VAR }}')).toBe('{{ VAR }}')
    })
  })

  describe('integration', () => {
    it('should work with markdown-like content', () => {
      const injector = new VariableInjector({
        variables: {
          SKILL_NAME: 'Memory Management',
          SKILL_DESC: 'Manage agent memory',
        },
      })

      const markdown = `
# {{ SKILL_NAME }}

{{ SKILL_DESC }}

## Usage

Use this skill to handle memory operations.
`.trim()

      const result = injector.inject(markdown)
      expect(result).toContain('# Memory Management')
      expect(result).toContain('Manage agent memory')
    })
  })
})
