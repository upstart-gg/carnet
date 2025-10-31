import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// Import auto-generated API documentation sidebar from TypeDoc
let apiSidebar = [
  {
    text: 'API Reference',
    items: [
      { text: 'Overview', link: '/api/' },
    ],
  },
]

try {
  const sidebarPath = path.join(__dirname, '../api/reference/typedoc-sidebar.json')
  if (fs.existsSync(sidebarPath)) {
    const sidebarJson = JSON.parse(fs.readFileSync(sidebarPath, 'utf-8'))
    if (Array.isArray(sidebarJson)) {
      apiSidebar = sidebarJson
    }
  }
} catch (e) {
  // TypeDoc sidebar not generated yet, use fallback
  console.warn('TypeDoc sidebar not found, using fallback API sidebar')
}

export default defineConfig({
  title: 'Carnet',
  description: 'Build system and content management for AI agents',
  lang: 'en-US',

  ignoreDeadLinks: [
    // Release process page will be completed later
    '/contributing/release-process',
    // CarnetConfig is exported as AppConfig in the API
    '/api/reference/type-aliases/CarnetConfig',
  ],

  head: [
    ['meta', { name: 'theme-color', content: '#3c3c3d' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
  ],

  lastUpdated: true,

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Carnet',

    nav: [
      { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
      { text: 'CLI', link: '/cli/', activeMatch: '/cli/' },
      { text: 'API', link: '/api/', activeMatch: '/api/' },
      { text: 'Content Types', link: '/content/', activeMatch: '/content/' },
      { text: 'Configuration', link: '/configuration/', activeMatch: '/configuration/' },
      {
        text: 'More',
        items: [
          { text: 'Contributing', link: '/contributing/' },
          { text: 'GitHub', link: 'https://github.com/upstart-gg/carnet' },
          { text: 'npm', link: 'https://www.npmjs.com/package/@upstart-gg/carnet' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Core Concepts', link: '/guide/concepts' },
            { text: 'Examples', link: '/guide/examples' },
          ],
        },
      ],
      '/cli/': [
        {
          text: 'CLI Commands',
          items: [
            { text: 'Overview', link: '/cli/' },
            { text: 'init', link: '/cli/init' },
            { text: 'build', link: '/cli/build' },
            { text: 'validate', link: '/cli/validate' },
            { text: 'list', link: '/cli/list' },
            { text: 'show', link: '/cli/show' },
          ],
        },
      ],
      '/api/': apiSidebar,
      '/content/': [
        {
          text: 'Content Types',
          items: [
            { text: 'Overview', link: '/content/' },
            { text: 'Agents', link: '/content/agents' },
            { text: 'Skills', link: '/content/skills' },
            { text: 'Toolsets', link: '/content/toolsets' },
            { text: 'Tools', link: '/content/tools' },
          ],
        },
      ],
      '/configuration/': [
        {
          text: 'Configuration',
          items: [
            { text: 'Overview', link: '/configuration/' },
            { text: 'carnet.config.json', link: '/configuration/config-file' },
            { text: 'Variables', link: '/configuration/variables' },
            { text: 'Advanced', link: '/configuration/advanced' },
          ],
        },
      ],
      '/contributing/': [
        {
          text: 'Contributing',
          items: [
            { text: 'Overview', link: '/contributing/' },
            { text: 'Development', link: '/contributing/development' },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/upstart-gg/carnet',
      },
      {
        icon: 'npm',
        link: 'https://www.npmjs.com/package/@upstart-gg/carnet',
      },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Upstart',
    },

    editLink: {
      pattern: 'https://github.com/upstart-gg/carnet/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    search: {
      provider: 'local',
    },
  },

  markdown: {
    lineNumbers: true,
    math: false,
  },
})
