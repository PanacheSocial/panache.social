import React from 'react'
import { ChevronDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '../lib/utils'

export function ScreenDevTools() {
  // This won't ship to your production build
  if (process.env.NODE_ENV === 'production') return null

  const [isShow, setIsShow] = useState(true)

  return (
    <div
      className={cn(
        'fixed bottom-10 left-10 isolate z-[1] transition-all',
        !isShow && 'bottom-0 translate-y-full'
      )}
    >
      {/* Toggle show-hide button */}
      <button
        onClick={() => setIsShow(!isShow)}
        className={cn(
          'absolute left-[50%] top-[-50%] z-[-1] translate-x-[-50%]',
          'size-10 rounded-full border bg-muted shadow',
          isShow && 'translate-y-[10%]'
        )}
      >
        <ChevronDown
          className={cn(
            'm-auto size-6 translate-y-[-25%] rotate-0 transition-all duration-200 active:scale-90',
            !isShow && 'rotate-180'
          )}
        />
      </button>

      {/* DevTools */}
      <div className="flex justify-between gap-1 rounded-full border bg-muted p-1 shadow">
        <ScreenSize />
        <ThemeSelector />
      </div>
    </div>
  )
}

function ScreenSize() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className={cn(
        'inline-flex w-fit items-center justify-center gap-2',
        'rounded-full border bg-background p-2 text-sm'
      )}
    >
      <div className="w-8 text-center">
        <div className="block sm:hidden">xs</div>
        <div className="hidden sm:block md:hidden">sm</div>
        <div className="hidden md:block lg:hidden">md</div>
        <div className="hidden lg:block xl:hidden">lg</div>
        <div className="hidden xl:block 2xl:hidden">xl</div>
        <div className="hidden 2xl:block">2xl</div>
      </div>

      <div className="h-full w-[2px] bg-muted" />

      <div>
        <span className="font-semibold">{windowWidth}</span>px
      </div>
    </div>
  )
}

// Btw, this theme selector is also ready to use as usual (with next-themes)
// could be extracted to reuse separately
function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      className="inline-flex w-fit items-center gap-1 rounded-full border bg-background p-1"
      role="radiogroup"
    >
      <button
        onClick={() => setTheme('light')}
        aria-checked={theme === 'light'}
        aria-label="Switch to light theme"
        className={cn('rounded-full p-2', theme === 'light' && 'bg-muted')}
        data-theme-switcher="true"
        role="radio"
        type="button"
      >
        <LightThemeIcon />
      </button>

      <button
        onClick={() => setTheme('system')}
        aria-checked={theme === 'system'}
        aria-label="Switch to system theme"
        className={cn('rounded-full p-2', theme === 'system' && 'bg-muted')}
        data-theme-switcher="true"
        role="radio"
        type="button"
      >
        <SystemThemeIcon />
      </button>

      <button
        onClick={() => setTheme('dark')}
        aria-checked={theme === 'dark'}
        aria-label="Switch to dark theme"
        className={cn('rounded-full p-2', theme === 'dark' && 'bg-muted')}
        data-theme-switcher="true"
        role="radio"
        type="button"
      >
        <DarkThemeIcon />
      </button>
    </div>
  )
}

function LightThemeIcon() {
  return (
    <svg
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
      style={{ color: 'currentcolor', width: '16px', height: '16px' }}
    >
      <circle cx="12" cy="12" r="5"></circle>
      <path d="M12 1v2"></path>
      <path d="M12 21v2"></path>
      <path d="M4.22 4.22l1.42 1.42"></path>
      <path d="M18.36 18.36l1.42 1.42"></path>
      <path d="M1 12h2"></path>
      <path d="M21 12h2"></path>
      <path d="M4.22 19.78l1.42-1.42"></path>
      <path d="M18.36 5.64l1.42-1.42"></path>
    </svg>
  )
}

function SystemThemeIcon() {
  return (
    <svg
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
      style={{ color: 'currentcolor', width: '16px', height: '16px' }}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M8 21h8"></path>
      <path d="M12 17v4"></path>
    </svg>
  )
}

function DarkThemeIcon() {
  return (
    <svg
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="24"
      style={{ color: 'currentcolor', width: '16px', height: '16px' }}
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
    </svg>
  )
}
