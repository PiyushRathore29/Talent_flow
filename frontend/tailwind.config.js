/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html'
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'anton': ['Anton SC', 'sans-serif'],
        'gambetta': ['Gambetta', 'serif'],
        'helvetica': ['Helvetica', 'Arial', 'sans-serif'],
        'impact': ['Impact', 'Arial Black', 'sans-serif'],
        'times': ['Times', 'serif']
      },
      colors: {
        primary: {
          50: '#F8F8F8',
          100: '#EEEEEE',
          200: '#E8E8E8',
          300: '#ACB5F7',
          400: '#4A61E2',
          500: '#0E1011',
          600: '#070707',
          700: '#868686'
        },
        teal: {
          400: '#6BB5A8',
          500: '#3C7C71',
          600: '#37999D',
          700: '#9CD3D6'
        },
        orange: {
          400: '#DE7C41',
          500: '#A44F1C'
        },
        red: {
          400: '#F55733',
          500: '#CB2C13',
          600: '#E53E48',
          700: '#9E151D'
        },
        purple: {
          400: '#9B83B0',
          500: '#5C4782'
        }
      },
      fontSize: {
        'hero': ['clamp(4rem, 12vw, 20rem)', '0.85em'],
        'display': ['clamp(3rem, 8vw, 15rem)', '0.85em'],
        'display-sm': ['clamp(2rem, 4vw, 6rem)', '1.1em'],
        'heading': ['clamp(1.5rem, 3vw, 5rem)', '1.1em'],
        'heading-sm': ['clamp(1.2rem, 2.5vw, 4rem)', '1.1em'],
        'subheading': ['clamp(1rem, 2vw, 2.66rem)', '1em'],
        'large': ['clamp(0.875rem, 1.5vw, 2rem)', '1.3em'],
        'medium': ['clamp(0.75rem, 1.2vw, 1.875rem)', '1em'],
        'body': ['clamp(0.875rem, 1vw, 1.625rem)', '1.3em'],
        'small': ['clamp(0.75rem, 0.8vw, 1.375rem)', '1.7em'],
        'nav': ['clamp(0.75rem, 0.8vw, 1.375rem)', '1em'],
        'caption': ['clamp(0.5rem, 0.6vw, 0.69rem)', '1.1em'],
        'tiny': ['clamp(0.35rem, 0.4vw, 0.43rem)', '1.4em']
      },
      letterSpacing: {
        'tight': '-0.025em',
        'tighter': '-0.0156em'
      },
      spacing: {
        '15': '3.75rem',
        '18': '4.5rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem'
      }
    },
  },
  plugins: [],
};
