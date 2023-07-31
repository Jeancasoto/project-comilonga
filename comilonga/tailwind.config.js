/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{svelte,js,ts}'],
	daisyui: {
	themes: ["winter", "pastel", "wireframe"],
	},
	plugins: [require('daisyui')]
};
