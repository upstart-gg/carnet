[@upstart-gg/carnet](../index.md) / Carnet

# Class: Carnet

Defined in: [src/lib/index.ts:7](https://github.com/upstart-gg/carnet/blob/a777803cf9e2d503ed8e3f12285db5ed6c389844/src/lib/index.ts#L7)

## Constructors

### Constructor

> **new Carnet**(`manifest`, `cwd`): `Carnet`

Defined in: [src/lib/index.ts:13](https://github.com/upstart-gg/carnet/blob/a777803cf9e2d503ed8e3f12285db5ed6c389844/src/lib/index.ts#L13)

#### Parameters

##### manifest

###### agents

`Record`\<`string`, \{ `description`: `string`; `initialSkills`: `string`[]; `name`: `string`; `prompt`: `string`; `skills`: `string`[]; \}\> = `...`

###### app

\{ `globalInitialSkills`: `string`[]; `globalSkills`: `string`[]; \} = `appConfigSchema`

###### app.globalInitialSkills

`string`[] = `...`

###### app.globalSkills

`string`[] = `...`

###### skills

`Record`\<`string`, \{ `content`: `string`; `description`: `string`; `name`: `string`; `toolsets`: `string`[]; \}\> = `...`

###### tools

`Record`\<`string`, \{ `content`: `string`; `description`: `string`; `name`: `string`; \}\> = `...`

###### toolsets

`Record`\<`string`, \{ `content`: `string`; `description`: `string`; `name`: `string`; `tools`: `string`[]; \}\> = `...`

###### version

`number` = `...`

##### cwd

`string` = `...`

#### Returns

`Carnet`

## Properties

### cwd

> `protected` **cwd**: `string`

Defined in: [src/lib/index.ts:9](https://github.com/upstart-gg/carnet/blob/a777803cf9e2d503ed8e3f12285db5ed6c389844/src/lib/index.ts#L9)

***

### manifest

> `protected` **manifest**: `object`

Defined in: [src/lib/index.ts:8](https://github.com/upstart-gg/carnet/blob/a777803cf9e2d503ed8e3f12285db5ed6c389844/src/lib/index.ts#L8)

#### agents

> **agents**: `Record`\<`string`, \{ `description`: `string`; `initialSkills`: `string`[]; `name`: `string`; `prompt`: `string`; `skills`: `string`[]; \}\>

#### app

> **app**: `object` = `appConfigSchema`

##### app.globalInitialSkills

> **globalInitialSkills**: `string`[]

##### app.globalSkills

> **globalSkills**: `string`[]

#### skills

> **skills**: `Record`\<`string`, \{ `content`: `string`; `description`: `string`; `name`: `string`; `toolsets`: `string`[]; \}\>

#### tools

> **tools**: `Record`\<`string`, \{ `content`: `string`; `description`: `string`; `name`: `string`; \}\>

#### toolsets

> **toolsets**: `Record`\<`string`, \{ `content`: `string`; `description`: `string`; `name`: `string`; `tools`: `string`[]; \}\>

#### version

> **version**: `number`

***

### MANIFEST\_FILENAME

> `static` **MANIFEST\_FILENAME**: `string` = `'carnet.manifest.json'`

Defined in: [src/lib/index.ts:11](https://github.com/upstart-gg/carnet/blob/a777803cf9e2d503ed8e3f12285db5ed6c389844/src/lib/index.ts#L11)

## Accessors

### agents

#### Get Signature

> **get** **agents**(): `Record`\<`string`, \{ `description`: `string`; `initialSkills`: `string`[]; `name`: `string`; `prompt`: `string`; `skills`: `string`[]; \}\>

Defined in: [src/lib/index.ts:35](https://github.com/upstart-gg/carnet/blob/a777803cf9e2d503ed8e3f12285db5ed6c389844/src/lib/index.ts#L35)

##### Returns

`Record`\<`string`, \{ `description`: `string`; `initialSkills`: `string`[]; `name`: `string`; `prompt`: `string`; `skills`: `string`[]; \}\>

## Methods

### fromFile()

> `static` **fromFile**(`manifestPath`, `cwd?`): `Promise`\<`Carnet`\>

Defined in: [src/lib/index.ts:18](https://github.com/upstart-gg/carnet/blob/a777803cf9e2d503ed8e3f12285db5ed6c389844/src/lib/index.ts#L18)

#### Parameters

##### manifestPath

`string`

##### cwd?

`string`

#### Returns

`Promise`\<`Carnet`\>

***

### getAgent()

> **getAgent**(`name`, `_options`): \{ `description`: `string`; `initialSkills`: `string`[]; `name`: `string`; `prompt`: `string`; `skills`: `string`[]; \} \| `undefined`

Defined in: [src/lib/index.ts:39](https://github.com/upstart-gg/carnet/blob/a777803cf9e2d503ed8e3f12285db5ed6c389844/src/lib/index.ts#L39)

#### Parameters

##### name

`string`

##### \_options

###### rewritePrompt?

`boolean`

#### Returns

\{ `description`: `string`; `initialSkills`: `string`[]; `name`: `string`; `prompt`: `string`; `skills`: `string`[]; \} \| `undefined`

***

### getSkill()

> **getSkill**(`name`): \{ `content`: `string`; `description`: `string`; `name`: `string`; `toolsets`: `string`[]; \} \| `undefined`

Defined in: [src/lib/index.ts:43](https://github.com/upstart-gg/carnet/blob/a777803cf9e2d503ed8e3f12285db5ed6c389844/src/lib/index.ts#L43)

#### Parameters

##### name

`string`

#### Returns

\{ `content`: `string`; `description`: `string`; `name`: `string`; `toolsets`: `string`[]; \} \| `undefined`

***

### getTool()

> **getTool**(`name`): \{ `content`: `string`; `description`: `string`; `name`: `string`; \} \| `undefined`

Defined in: [src/lib/index.ts:51](https://github.com/upstart-gg/carnet/blob/a777803cf9e2d503ed8e3f12285db5ed6c389844/src/lib/index.ts#L51)

#### Parameters

##### name

`string`

#### Returns

\{ `content`: `string`; `description`: `string`; `name`: `string`; \} \| `undefined`

***

### getToolset()

> **getToolset**(`name`): \{ `content`: `string`; `description`: `string`; `name`: `string`; `tools`: `string`[]; \} \| `undefined`

Defined in: [src/lib/index.ts:47](https://github.com/upstart-gg/carnet/blob/a777803cf9e2d503ed8e3f12285db5ed6c389844/src/lib/index.ts#L47)

#### Parameters

##### name

`string`

#### Returns

\{ `content`: `string`; `description`: `string`; `name`: `string`; `tools`: `string`[]; \} \| `undefined`
