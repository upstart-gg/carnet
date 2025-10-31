import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Carnet',
  description: 'Build system and content management for AI agents',
  lang: 'en-US',

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
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Carnet Class', link: '/api/carnet-class' },
            { text: 'build()', link: '/api/build-function' },
            { text: 'validate()', link: '/api/validate-function' },
            { text: 'Types', link: '/api/types' },
          ],
        },
      ],
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
