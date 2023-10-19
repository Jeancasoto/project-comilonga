/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{svelte,js,ts}'],
	daisyui: {
	themes: [{
		pastel: {
			...require("daisyui/src/theming/themes")["[data-theme=pastel]"],
			"primary": "#ffe121",
			"secondary": "#CC4141",
			"primary-focus": "#E5A0A0",
			"secondary-focus": "#FFF090",
			"accent": "#FFFFF",
			"neutral": "#892722",
			"base-100": "#ffffff",
			".btn:hover": {
				"background-color": "#FFFFF",
			  },
		  },
		  
	}],
	},
	plugins: [require('daisyui')]
};
