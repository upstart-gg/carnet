import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export default defineConfig({
  title: 'Carnet',
  description: 'Build system and content management for AI agents',
  lang: 'en-US',

  ignoreDeadLinks: [
    // Release process page will be completed later
    '/contributing/release-process',
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
            { text: 'lint', link: '/cli/lint' },
            { text: 'list', link: '/cli/list' },
            { text: 'show', link: '/cli/show' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Examples', link: '/api/examples' },
          ],
        },
        {
          text: 'API Methods',
          items: [
            { text: 'Content Retrieval', link: '/api/methods/content-retrieval' },
            { text: 'Metadata Retrieval', link: '/api/methods/metadata-retrieval' },
            { text: 'Listing Methods', link: '/api/methods/listing' },
            { text: 'Prompt Generation', link: '/api/methods/prompt-generation' },
          ],
        },
        {
          text: 'Concepts',
          items: [
            { text: 'Variable Injection', link: '/api/concepts/variable-injection' },
            { text: 'Progressive Loading', link: '/api/concepts/progressive-loading' },
          ],
        },
        {
          text: 'Reference',
          items: [
            { text: 'Type Definitions', link: '/api/types' },
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
        {
          text: 'Manifest',
          items: [{ text: 'Schema', link: '/content/manifest-schema' }],
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
    lineNumbers: false,
    math: false,
    config(md) {
      md.use(tabsMarkdownPlugin)
    },
  },
})
