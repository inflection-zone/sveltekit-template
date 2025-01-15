const { error } = require('console');

module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        base: 'var(--base-color)',
        info: 'var(--info-color)',
        accent: 'var(--accent-color)',
        neutral: 'var(--neutral-color)',
        error: 'var(--error-color)',
        success: 'var(--success-color)',
        active: 'var(--active-color)',
        outline: 'var(--outline-color)'
      },
      fontFamily: {}
    }
  },
  plugins: []
};
