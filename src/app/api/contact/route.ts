import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Simple in-memory store for rate limiting
const rateLimit = new Map()
const RATE_LIMIT_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds
const MAX_REQUESTS = 5 // Maximum 5 requests per hour

// Create reusable transporter with more explicit configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  debug: true, // Add debug option
  logger: true // Add logger option
})

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('Transporter verification error:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

export async function POST(request: Request) {
  try {
    // First verify we have credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.error('Missing email credentials:', {
        user: !!process.env.EMAIL_USER,
        pass: !!process.env.EMAIL_APP_PASSWORD
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Log credentials (remove in production)
    console.log('Email configuration:', {
      user: process.env.EMAIL_USER,
      passLength: process.env.EMAIL_APP_PASSWORD?.length
    });

    // Get IP address for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    
    // Check rate limit
    const userRequests = rateLimit.get(ip) || { count: 0, timestamp: now }
    
    // Reset count if outside duration window
    if (now - userRequests.timestamp > RATE_LIMIT_DURATION) {
      userRequests.count = 0
      userRequests.timestamp = now
    }
    
    // Check if rate limit exceeded
    if (userRequests.count >= MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }
    
    // Increment request count
    userRequests.count++
    rateLimit.set(ip, userRequests)

    const body = await request.json()
    const { firstName, lastName, workEmail, country, message } = body

    // Validate required fields
    if (!firstName || !lastName || !workEmail || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(workEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create email content
    const emailContent = `
      New Contact Form Submission
      
      Name: ${firstName} ${lastName}
      Email: ${workEmail}
      Country: ${country}
      
      Message:
      ${message}
    `

    // Send email
    await transporter.sendMail({
      from: `"Cove Lane Contact Form" <${process.env.EMAIL_USER}>`,
      to: 'info@covelane.health',
      replyTo: workEmail,
      subject: `New Contact Form Submission from ${firstName} ${lastName}`,
      text: emailContent,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${workEmail}</p>
        <p><strong>Country:</strong> ${country}</p>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    return NextResponse.json({ 
      message: 'Message sent successfully',
      remainingRequests: MAX_REQUESTS - userRequests.count
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    )
  }
} 