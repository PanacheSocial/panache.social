import Logo from '#common/ui/components/logo'
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import User from '#common/models/user'
import React from 'react'

interface OtpEmailProps {
  user: User
}

export const OtpEmail = ({ user }: OtpEmailProps) => (
  <Html>
    <Head />
    <Preview>Your OTP for Panache</Preview>
    <Body style={main}>
      <Container style={container}>
        <Logo />
        <Text style={paragraph}>
          Hi {user.firstName} {user.lastName},
        </Text>
        <Text style={paragraph}>
          Your One-Time Password (OTP) for Panache is:
        </Text>
        <Section style={otpContainer}>
          <Text style={otpText}>{user.verification_code}</Text>
        </Section>
        <Text style={paragraph}>
          Please use this OTP to complete your login or verification process. This OTP is valid for a limited time.
        </Text>
        <Text style={paragraph}>
          If you did not request this OTP, please ignore this email or contact support if you have questions.
        </Text>
        <Text style={paragraph}>
          Best,
          <br />
          The Panache team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you're having trouble using the OTP, please contact our support team.
        </Text>
      </Container>
    </Body>
  </Html>
)


const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
}

const otpContainer = {
  textAlign: 'center' as const,
  margin: '20px 0',
}

const otpText = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#000000',
}
