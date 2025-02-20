import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { onRequest } from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'
import * as nodemailer from 'nodemailer'
import { defineString } from 'firebase-functions/params'

admin.initializeApp()

// Define config parameters
const emailUser = defineString('EMAIL_USER')
const emailPassword = defineString('EMAIL_APP_PASSWORD')

interface UserData {
  email: string
  role: string
}

// Create transporter function
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: emailUser.value(),
      pass: emailPassword.value(),
    }
  })
}

// Basic email sending function
export const sendEmail = onRequest(async (req, res) => {
  const transporter = createTransporter()
  
  try {
    await transporter.sendMail({
      from: emailUser.value(),
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
    })
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})