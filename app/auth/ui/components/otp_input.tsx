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
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      //@ts-ignore
      (event.target as HTMLInputElement).previousSibling?.focus()
    }
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
          className="w-12 h-12 text-center border border-gray-300 rounded"
        />
      ))}
    </div>
  )
}
