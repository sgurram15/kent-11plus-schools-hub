/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
    	extend: {
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: '#1e3a8a',
    				foreground: '#ffffff'
    			},
    			secondary: {
    				DEFAULT: '#d97706',
    				foreground: '#ffffff'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))',
    				green: '#15803d',
    				red: '#b91c1c'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			stone: {
    				50: '#fafaf9',
    				100: '#f5f5f4',
    				200: '#e7e5e4',
    				300: '#d6d3d1',
    				400: '#a8a29e',
    				500: '#78716c',
    				600: '#57534e',
    				700: '#44403c',
    				800: '#292524',
    				900: '#1c1917'
    			}
    		},
    		fontFamily: {
    			heading: ['Playfair Display', 'serif'],
    			body: ['Inter', 'sans-serif'],
    			mono: ['JetBrains Mono', 'monospace']
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: { height: '0' },
    				to: { height: 'var(--radix-accordion-content-height)' }
    			},
    			'accordion-up': {
    				from: { height: 'var(--radix-accordion-content-height)' },
    				to: { height: '0' }
    			},
    			'fade-in': {
    				from: { opacity: '0', transform: 'translateY(10px)' },
    				to: { opacity: '1', transform: 'translateY(0)' }
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'fade-in': 'fade-in 0.5s ease-out forwards'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
};
