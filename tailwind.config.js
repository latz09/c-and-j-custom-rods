const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		// ── Client palette (style guide → starter slots) ──────────────────
		// NOTE: guide gave 5 named colors for 6 slots. `tertiary` reuses
		// Fishing Blue (no 6th brand color was supplied) — flag for review.
		colors: {
			primary: '#1075BD', // Fishing Blue — primary CTA fill, main brand color
			secondary: '#8BC63D', // Summer Green
			accent: '#D2D2D2', // Light Gray
			tertiary: '#1075BD', // Fishing Blue (reused — guide had no 6th color)
			dark: '#161616', // Black
			light: '#FCFCFC', // White
			transparent: 'transparent',
			current: 'currentColor',
			white: '#ffffff',
			black: '#000000',
		},

		// ── Fonts ─────────────────────────────────────────────────────────
		// Both vars set in layout.js via next/font.
		// Guide uses ONE family — Roboto Condensed — for both headings and
		// body, so --font-heading and --font-body both resolve to it.
		fontFamily: {
			default: ['var(--font-body)', ...fontFamily.sans], // Roboto Condensed
			heading: ['var(--font-heading)', ...fontFamily.sans], // Roboto Condensed
		},

		// Full spacing scale — unchanged from starter
		spacing: {
			0: '0',
			0.25: '0.25rem',
			0.5: '0.5rem',
			0.75: '0.75rem',
			1: '1rem',
			1.25: '1.25rem',
			1.5: '1.5rem',
			2: '2rem',
			2.5: '2.5rem',
			3: '3rem',
			3.75: '3.75rem',
			4: '4rem',
			5: '5rem',
			5.5: '5.5rem',
			6: '6rem',
			7.5: '7.5rem',
			8: '8rem',
			8.75: '8.75rem',
			10: '10rem',
			12: '12rem',
			16: '16rem',
			22: '22rem',
			24: '24rem',
			32: '32rem',
			none: '0',
			xxs: '1rem',
			xs: '1.5rem',
			sm: '2rem',
			md: '2.5rem',
			lg: '4rem',
			xl: '5rem',
			xxl: '8.75rem',
		},
		zIndex: {
			0: '0',
			10: '10',
			20: '20',
			30: '30',
			40: '40',
			50: '50',
			auto: 'auto',
		},

		// ── Border radius ─────────────────────────────────────────────────
		// One rounded size for the whole site, per client (0.625rem),
		// plus full and 0 on hand.
		borderRadius: {
			none: '0',
			DEFAULT: '0.625rem', // the standard roundness — `rounded`
			sm: '0.25rem', // `rounded-sm`
			full: '9999px',
		},

		boxShadow: {
			none: 'none',
			soft: '0 1px 8px rgba(0, 0, 0, 0.08)',
			card: '0 4px 16px rgba(0, 0, 0, 0.1)',
			lifted: '0 8px 24px rgba(0, 0, 0, 0.12)',
		},

		extend: {
			screens: {
				'3xl': '1920px',
			},
			maxWidth: {
				'8xl': '1920px',
				container: '1440px',
			},
			transitionDuration: {
				DEFAULT: '300ms',
			},
			animation: {
				scroll: 'scroll 70s linear infinite',
			},
			keyframes: {
				scroll: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-50%)' },
				},
			},
		},
	},
	plugins: [
		function ({ addUtilities }) {
			addUtilities({
				'.scrollbar-hide': {
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none',
					'&::-webkit-scrollbar': {
						display: 'none',
					},
				},
				'.no-scroll': {
					overflow: 'hidden !important',
					height: '100% !important',
				},
			});
		},
	],
};