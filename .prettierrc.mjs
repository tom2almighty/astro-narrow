/*
 * Style options mirror how the codebase is already written (single quotes,
 * no trailing commas, ~100-column lines) so the initial format pass stays
 * small. prettier-plugin-tailwindcss must be last in `plugins`; it reads the
 * Tailwind v4 CSS-first config from `tailwindStylesheet` to sort classes.
 */
export default {
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 100,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/styles/global.css',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
};
