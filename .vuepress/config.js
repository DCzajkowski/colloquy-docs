module.exports = {
    title: 'Colloquy',
    description: 'A framework-agnostic package for managing persistent conversation contexts.',
    base: '/',
    head: [
        ['link', { rel: 'icon', type:'image/png', href: '/assets/img/favicon.png' }],
    ],
    themeConfig: {
        logo: '/assets/img/logo-just-text.svg',
        repo: '',
        docsRepo: 'dczajkowski/colloquy-docs',
        editLinks: true,
        docsDir: '',
        editLinkText: 'Edit this page on GitHub',
        sidebarDepth: 2,
        nav: [
            { text: 'Documentation', link: '/introduction' },
        ],
        sidebar: [
            ['/introduction', 'Introduction'],
            ['/installation', 'Installation'],
            ['/basic-usage', 'Basic Usage'],
            ['/creating-custom-driver', 'Creating a Custom Driver'],
            ['/used-design-patterns', 'Used Design Patterns'],
        ],
    },
}
