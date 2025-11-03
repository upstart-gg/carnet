import { describe, expect, it } from 'bun:test'
import { loadEnvConfig, mergeConfigurations } from '../../src/lib/config'

describe('loadEnvConfig', () => {
  it('should return empty object when no env vars are set', () => {
    const config = loadEnvConfig({})
    expect(config).toEqual({})
  })

  it('should load CARNET_OUTPUT', () => {
    const config = loadEnvConfig({ CARNET_OUTPUT: './build' })
    expect(config.output).toBe('./build')
  })

  it('should load CARNET_INCLUDE as comma-separated array', () => {
    const config = loadEnvConfig({ CARNET_INCLUDE: '**/*.md, src/**, tests/**' })
    expect(config.include).toEqual(['**/*.md', 'src/**', 'tests/**'])
  })

  it('should load CARNET_EXCLUDE as comma-separated array', () => {
    const config = loadEnvConfig({ CARNET_EXCLUDE: '**/draft/**, **/*.example.md' })
    expect(config.exclude).toEqual(['**/draft/**', '**/*.example.md'])
  })

  it('should load CARNET_GLOBAL_SKILLS as comma-separated array', () => {
    const config = loadEnvConfig({ CARNET_GLOBAL_SKILLS: 'auth, logging, analytics' })
    expect(config.app?.globalSkills).toEqual(['auth', 'logging', 'analytics'])
  })

  it('should load CARNET_GLOBAL_INITIAL_SKILLS as comma-separated array', () => {
    const config = loadEnvConfig({ CARNET_GLOBAL_INITIAL_SKILLS: 'core, utils' })
    expect(config.app?.globalInitialSkills).toEqual(['core', 'utils'])
  })

  it('should load both global skills and global initial skills together', () => {
    const config = loadEnvConfig({
      CARNET_GLOBAL_SKILLS: 'skill1, skill2',
      CARNET_GLOBAL_INITIAL_SKILLS: 'init1, init2',
    })
    expect(config.app?.globalSkills).toEqual(['skill1', 'skill2'])
    expect(config.app?.globalInitialSkills).toEqual(['init1', 'init2'])
  })

  it('should trim whitespace in array values', () => {
    const config = loadEnvConfig({
      CARNET_INCLUDE: '  pattern1  ,  pattern2  ,  pattern3  ',
    })
    expect(config.include).toEqual(['pattern1', 'pattern2', 'pattern3'])
  })

  it('should handle empty strings in comma-separated values', () => {
    const config = loadEnvConfig({
      CARNET_INCLUDE: 'pattern1,,pattern2',
    })
    // Empty strings after trim should still be in array
    expect(config.include).toContain('pattern1')
    expect(config.include).toContain('pattern2')
  })

  it('should load multiple environment variables together', () => {
    const config = loadEnvConfig({
      CARNET_OUTPUT: './build',
      CARNET_INCLUDE: 'src/**, tests/**',
      CARNET_EXCLUDE: 'draft/**',
      CARNET_GLOBAL_SKILLS: 'utils, logging',
    })

    expect(config.output).toBe('./build')
    expect(config.include).toEqual(['src/**', 'tests/**'])
    expect(config.exclude).toEqual(['draft/**'])
    expect(config.app?.globalSkills).toEqual(['utils', 'logging'])
  })

  it('should ignore unknown environment variables', () => {
    const config = loadEnvConfig({
      CARNET_OUTPUT: './build',
      UNKNOWN_VAR: 'should be ignored',
      ANOTHER_VAR: 'also ignored',
    })

    expect(config).toEqual({ output: './build' })
  })
})

describe('Configuration Precedence', () => {
  it('should apply defaults when no config provided', () => {
    const config = mergeConfigurations({}, {}, {})
    expect(config.output).toBe('./dist')
  })

  it('should override defaults with file config', () => {
    const fileConfig = { output: './out' }
    const config = mergeConfigurations(fileConfig, {}, {})

    expect(config.output).toBe('./out')
  })

  it('should override file config with env config', () => {
    const fileConfig = { output: './file-out' }
    const envConfig = { output: './env-out' }
    const config = mergeConfigurations(fileConfig, envConfig, {})

    expect(config.output).toBe('./env-out')
  })

  it('should override env config with CLI config', () => {
    const fileConfig = { output: './file-out' }
    const envConfig = { output: './env-out' }
    const cliConfig = { output: './cli' }
    const config = mergeConfigurations(fileConfig, envConfig, cliConfig)

    expect(config.output).toBe('./cli')
  })

  it('should follow full precedence: defaults < file < env < cli', () => {
    const fileConfig = { include: ['file-pattern'] }
    const envConfig = { output: './env-output', include: ['env-pattern'] }
    const cliConfig = { output: './cli-output' }
    const config = mergeConfigurations(fileConfig, envConfig, cliConfig)

    // output: in env and cli, cli wins
    expect(config.output).toBe('./cli-output')
    // include: in file and env, env wins
    expect(config.include).toEqual(['env-pattern'])
  })

  it('should merge app config objects', () => {
    const fileConfig = {
      app: {
        globalSkills: ['file-skill'],
        globalInitialSkills: [],
      },
    }
    const envConfig = {
      app: {
        globalSkills: ['env-skill'],
        globalInitialSkills: ['env-init'],
      },
    }
    const cliConfig = {
      app: {
        globalSkills: ['cli-skill'],
        globalInitialSkills: [],
      },
    }

    const config = mergeConfigurations(fileConfig, envConfig, cliConfig)

    // CLI wins for both
    expect(config.app).toBeDefined()
    if (config.app) {
      expect(config.app.globalSkills).toEqual(['cli-skill'])
      expect(config.app.globalInitialSkills).toEqual([])
    }
  })

  it('should handle mixed undefined values in precedence chain', () => {
    const fileConfig = { output: './file' }
    const envConfig = undefined
    const cliConfig = { output: './cli' }

    const config = mergeConfigurations(fileConfig, envConfig, cliConfig)

    expect(config.output).toBe('./cli')
  })
})
