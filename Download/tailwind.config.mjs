/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		fontFamily:{sans:'Roboto Mono, monospace'},
		extend: {
		  height:{screen:'100dvh'},
		},
	  },
	 plugins: ['prettier-plugin-tailwindcss'],
}
