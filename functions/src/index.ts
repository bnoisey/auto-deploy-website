import { onRequest } from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'

admin.initializeApp()

// Simple contact form endpoint
export const contact = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  const { name, email, message } = req.body

  try {
    // Store the contact form submission in Firestore
    await admin.firestore().collection('contacts').add({
      name,
      email,
      message,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    res.status(200).json({ message: 'Contact form submitted successfully' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})