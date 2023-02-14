/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        333: '#333',
        444: '#444',
        555: '#555',
        666: '#666',
        888: '#888',
        999: '#999',
        ccc: '#ccc',
        primary: '#4F81FF',
        orange: '#FF8D1A',
        white: '#fff',
      },
      spacing: {
        2: '2px',
        4: '4px',
        6: '6px',
        8: '8px',
        10: '10px',
        12: '12px',
        14: '14px',
        16: '16px',
        18: '18px',
        20: '20px',
        22: '22px',
        24: '24px',
        28: '28px',
        30: '30px',
        32: '32px',
      },
      borderRadius: {
        2: '2px',
        4: '4px',
        6: '6px',
        8: '8px',
        10: '10px',
        12: '12px',
      },
      fontSize: {
        8: '8px',
        10: '10px',
        12: '12px',
        14: '14px',
        16: '16px',
        18: '18px',
        20: '20px',
        22: '22px',
        24: '24px',
      },
      minWidth: {
        100: '100px',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
};
