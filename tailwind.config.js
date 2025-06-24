/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
    },
  },
  plugins: [],
  safelist: [
    // Color panel and picker
    'w-full', 'h-40', 'h-36', 'relative', 'rounded-lg', 'bg-white', 'border', 'shadow-lg', 'p-4', 'min-w-[280px]', 'mt-1', 'left-0',
    'color-gradient-area', 'color-selector-circle', 'hue-slider', 'hue-selector', 'color-preview',
    // Toolbar
    'flex', 'flex-row', 'flex-wrap', 'gap-2', 'items-center', 'mb-3', 'bg-gray-100', 'hover:bg-gray-200', 'border-none', 'rounded-md', 'p-1.5', 'transition-all', 'duration-200', 'cursor-pointer', 'justify-center', 'bg-indigo-500', 'text-white',
    // Editor area
    'editor-area', 'min-h-[120px]', 'max-h-[260px]', 'p-3', 'border-gray-300', 'rounded-lg', 'bg-gray-50', 'text-sm', 'outline-none', 'overflow-y-auto', 'transition-all', 'duration-200', 'text-right', 'text-left', 'ring-2', 'ring-indigo-500', 'ring-opacity-50',
    // Misc
    'absolute', 'z-30', 'z-50', 'rounded', 'rounded-full', 'shadow-inner', 'shadow-sm', 'shadow-xl', 'text-xs', 'text-base', 'text-lg', 'text-gray-400', 'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-900', 'text-[#261E27]', 'text-[#FABF35]', 'text-red-600', 'bg-black', 'bg-blue-500', 'bg-blue-600', 'bg-blue-50', 'bg-gray-300', 'bg-gray-400', 'bg-gray-200', 'bg-gray-100', 'bg-gray-50', 'bg-green-500', 'bg-red-50', 'bg-green-50', 'bg-indigo-500', 'bg-white', 'border-gray-200', 'border-blue-500', 'border-gray-300', 'border-red-500', 'border-green-500',
    // Buttons
    'px-4', 'py-2', 'px-3', 'py-1', 'rounded', 'hover:bg-blue-600', 'hover:bg-gray-400', 'hover:bg-gray-200', 'hover:bg-gray-700', 'hover:text-gray-700', 'hover:text-gray-600', 'transition-colors', 'disabled:opacity-50', 'disabled:cursor-not-allowed',
    // Modal
    'fixed', 'inset-0', 'items-center', 'justify-center', 'bg-opacity-50', 'max-w-4xl', 'w-full', 'mx-4', 'max-h-[90vh]', 'overflow-hidden', 'overflow-y-auto', 'max-h-[calc(90vh-120px)]', 'max-h-[calc(90vh-180px)]',
    // Language toggle
    'px-2', 'py-1', 'font-bold', 'font-normal', 'font-semibold', 'font-tajawal',
    // Custom classes
    'editor-container', 'toolbar-btn', 'toolbar-btn-active', 'icon', 'lang-switch-btn', 'media-remove-btn',
  ],
} 