import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
    title: 'ICS 2025 Miao',
    tagline: '',
    favicon: 'img/favicon.ico',

    // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    url: 'https://lc3.skjsjhb.moe',
    baseUrl: '/',

    organizationName: 'skjsjhb', // Usually your GitHub org/user name.
    projectName: 'LC3-Docs', // Usually your repo name.

    onBrokenLinks: 'warn',
    markdown: {
        hooks: {
            onBrokenMarkdownLinks: "warn"
        }
    },

    i18n: {
        defaultLocale: 'zh-Hans',
        locales: ['zh-Hans'],
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    // editUrl:
                    //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex],
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        // image: '',
        navbar: {
            title: 'ICS 2025',
            // logo: {
            //     alt: 'My Site Logo',
            //     src: 'img/logo.svg',
            // },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'LC-3 大抄',
                },
                { to: 'https://lc3xt.skjsjhb.moe', label: 'LC-3 评测姬', position: 'left' },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                // {
                //     title: 'Docs',
                //     items: [
                //         {
                //             label: 'Tutorial',
                //             to: '/docs/intro',
                //         },
                //     ],
                // },
                // {
                //     title: 'Community',
                //     items: [
                //         {
                //             label: 'Stack Overflow',
                //             href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                //         },
                //         {
                //             label: 'Discord',
                //             href: 'https://discordapp.com/invite/docusaurus',
                //         },
                //         {
                //             label: 'X',
                //             href: 'https://x.com/docusaurus',
                //         },
                //     ],
                // },
                // {
                //     title: 'More',
                //     items: [
                //         {
                //             label: 'Blog',
                //             to: '/blog',
                //         },
                //         {
                //             label: 'GitHub',
                //             href: 'https://github.com/facebook/docusaurus',
                //         },
                //     ],
                // },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} ICS 课程组，保留所有权利。`,
        },
        prism: {
            theme: prismThemes.vsLight,
            darkTheme: prismThemes.vsDark,
        },
    } satisfies Preset.ThemeConfig,

    stylesheets: [
        {
            href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
            type: 'text/css',
            integrity:
                'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
            crossorigin: 'anonymous',
        },
    ],
};

export default config;
