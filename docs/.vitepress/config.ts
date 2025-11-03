import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

export default defineConfig({
  title: 'Carnet',
  description:
    'Framework for building AI agents with Vercel AI SDK using markdown-based definitions',
  lang: 'en-US',

  ignoreDeadLinks: [],

  head: [
    ['meta', { name: 'theme-color', content: '#7270c6' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&display=swap',
        rel: 'stylesheet',
      },
    ],
  ],

  lastUpdated: true,

  themeConfig: {
    logo: '/carnet.png',
    siteTitle: false,

    nav: [
      { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
      { text: 'CLI', link: '/cli/', activeMatch: '/cli/' },
      { text: 'API', link: '/api/', activeMatch: '/api/' },
      { text: 'Configuration', link: '/configuration/', activeMatch: '/configuration/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Overview', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ],
        },
        {
          text: 'Learning',
          items: [
            { text: 'Core Concepts', link: '/guide/concepts' },
            { text: 'Using with Vercel AI SDK', link: '/guide/vercel-ai-sdk' },
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
            { text: 'Variable Injection', link: '/api/variable-injection' },
            { text: 'Error Handling', link: '/api/error-handling' },
          ],
        },
        {
          text: 'Concepts',
          items: [{ text: 'Progressive Loading', link: '/api/concepts/progressive-loading' }],
        },
      ],
      '/configuration/': [
        {
          text: 'Configuration',
          items: [
            { text: 'Overview', link: '/configuration/' },
            { text: 'carnet.config.json', link: '/configuration/config-file' },
          ],
        },
        {
          text: 'Content Structure',
          items: [
            { text: 'Agents', link: '/configuration/content-structure/agents' },
            { text: 'Skills', link: '/configuration/content-structure/skills' },
            { text: 'Toolsets', link: '/configuration/content-structure/toolsets' },
            { text: 'Tools', link: '/configuration/content-structure/tools' },
          ],
        },
        {
          text: 'Output',
          items: [{ text: 'Manifest Schema', link: '/configuration/manifest-schema' }],
        },
      ],
      '/contributing/': [
        {
          text: 'Contributing',
          items: [{ text: 'Overview', link: '/contributing/' }],
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
