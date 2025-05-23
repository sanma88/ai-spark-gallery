
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
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
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
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
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 0 rgba(139, 92, 246, 0)' },
					'50%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'card-highlight': {
					'0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(139, 92, 246, 0)' },
					'50%': { transform: 'scale(1.05)', boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' }
				},
				'card-pulse': {
					'0%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(139, 92, 246, 0)' },
					'20%': { transform: 'scale(1.08)', boxShadow: '0 0 30px rgba(139, 92, 246, 0.7)' },
					'40%': { transform: 'scale(1.04)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
					'60%': { transform: 'scale(1.06)', boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)' },
					'80%': { transform: 'scale(1.03)', boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' },
					'100%': { transform: 'scale(1)', boxShadow: '0 0 0 rgba(139, 92, 246, 0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite',
				'fade-in': 'fade-in 0.3s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'card-highlight': 'card-highlight 1.5s ease-in-out',
				'card-pulse': 'card-pulse 1.5s ease-in-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
