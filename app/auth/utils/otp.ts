import { randomBytes } from 'crypto'

export function generateOtp(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const buffer = randomBytes(length)
  let otp = ''

  for (let i = 0; i < length; i++) {
    otp += chars[buffer[i] % chars.length]
  }

  return otp
}
