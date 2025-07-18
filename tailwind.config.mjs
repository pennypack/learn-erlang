/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              color: theme('colors.gray.800'),
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: 0,
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
            h1: {
              color: theme('colors.gray.100'),
              code: {
                backgroundColor: theme('colors.gray.100'),
                color: theme('colors.gray.800'),
                padding: '0.125rem 0.375rem',
                borderRadius: '0.25rem',
              },
            },
            h2: {
              color: theme('colors.gray.100'),
              code: {
                backgroundColor: theme('colors.gray.100'),
                color: theme('colors.gray.800'),
                padding: '0.125rem 0.375rem',
                borderRadius: '0.25rem',
              },
            },
            h3: {
              color: theme('colors.gray.100'),
              code: {
                backgroundColor: theme('colors.gray.100'),
                color: theme('colors.gray.800'),
                padding: '0.125rem 0.375rem',
                borderRadius: '0.25rem',
              },
            },
            h4: {
              color: theme('colors.gray.100'),
              code: {
                backgroundColor: theme('colors.gray.100'),
                color: theme('colors.gray.800'),
                padding: '0.125rem 0.375rem',
                borderRadius: '0.25rem',
              },
            },
            h5: {
              color: theme('colors.gray.100'),
              code: {
                backgroundColor: theme('colors.gray.100'),
                color: theme('colors.gray.800'),
                padding: '0.125rem 0.375rem',
                borderRadius: '0.25rem',
              },
            },
            h6: {
              color: theme('colors.gray.100'),
              code: {
                backgroundColor: theme('colors.gray.100'),
                color: theme('colors.gray.800'),
                padding: '0.125rem 0.375rem',
                borderRadius: '0.25rem',
              },
            },
            strong: {
              color: theme('colors.gray.100'),
            },
            code: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.200'),
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
              color: theme('colors.gray.300'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}