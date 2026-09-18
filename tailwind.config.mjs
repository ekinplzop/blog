/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-base)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        border: 'rgb(var(--border) / <alpha-value>)',
        content: 'rgb(var(--content) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        
        // 品牌与认知色谱 (Claude 规范 HSL 色彩代币)
        brand: {
          primary: 'hsl(var(--brand-primary))',
          secondary: 'hsl(var(--brand-secondary))',
        },

        // 认知生命周期语义色
        seedling: {
          light: '#fef3c7',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        'in-progress': {
          light: '#e0f2fe',
          DEFAULT: '#0284c7',
          dark: '#0369a1',
        },
        evergreen: {
          light: '#dcfce7',
          DEFAULT: '#10b981',
          dark: '#047857',
        },
        superseded: {
          light: '#ffe4e6',
          DEFAULT: '#f43f5e',
          dark: '#be123c',
        }
      },
      spacing: {
        'phi-xs': 'var(--space-xs)',
        'phi-sm': 'var(--space-sm)',
        'phi-md': 'var(--space-md)',
        'phi-lg': 'var(--space-lg)',
        'phi-xl': 'var(--space-xl)',
        'phi-2xl': 'var(--space-2xl)',
      },
      fontFamily: {
        sans: ['Inter', 'Geist Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-sky': '0 0 25px rgba(59, 130, 246, 0.16)',
        'glow-emerald': '0 0 25px rgba(16, 185, 129, 0.16)',
        'elevated-3d': '0 16px 36px -12px rgba(0, 0, 0, 0.55)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'inherit',
            lineHeight: '1.8',
            '--tw-prose-body': 'inherit',
            '--tw-prose-headings': 'inherit',
            '--tw-prose-links': '#38bdf8',
            '--tw-prose-code': 'inherit',
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              fontWeight: '500',
              '&:hover': {
                color: '#7dd3fc',
              },
            },
            code: {
              fontWeight: '500',
              padding: '0.15rem 0.35rem',
              borderRadius: '0.35rem',
              backgroundColor: 'rgba(39, 39, 45, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
