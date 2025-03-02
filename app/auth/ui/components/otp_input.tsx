import React, { useState } from 'react'

interface OTPInputProps {
  length: number
  onChange: (otp: string) => void
}

export const OTPInput: React.FC<OTPInputProps> = ({ length, onChange }) => {
  const [otp, setOtp] = useState(Array(length).fill(''))

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^A-Za-z0-9]/g, '')
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    onChange(newOtp.join(''))

    if (value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'v') return
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      const previousSibling = (event.target as HTMLInputElement)
        .previousSibling as HTMLInputElement | null
      previousSibling?.focus()
      return
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      const previousSibling = (event.target as HTMLInputElement)
        .previousSibling as HTMLInputElement | null
      previousSibling?.focus()
      return
    }

    if (event.key === 'ArrowRight' && index < length - 1) {
      const nextSibling = (event.target as HTMLInputElement).nextSibling as HTMLInputElement | null
      nextSibling?.focus()
      return
    }

    if (event.key.match(/[A-Za-z0-9]/) && event.key.length === 1) {
      event.preventDefault()
      const value = event.key
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp]
        newOtp[index] = value
        onChange(newOtp.join(''))
        return newOtp
      })

      if (index < length - 1) {
        const nextSibling = (event.target as HTMLInputElement)
          .nextSibling as HTMLInputElement | null
        nextSibling?.focus()
      } else {
        ;(event.target as HTMLInputElement).blur()
      }
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const paste = event.clipboardData
      .getData('text')
      .slice(0, length)
      .replace(/[^A-Za-z0-9]/g, '')
    const newOtp = Array.from({ length }, (_, i) => paste[i] || '')
    setOtp(newOtp)
    onChange(newOtp.join(''))
  }

  return (
    <div className="flex space-x-2 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center border border-gray-300 rounded"
        />
      ))}
    </div>
  )
}
