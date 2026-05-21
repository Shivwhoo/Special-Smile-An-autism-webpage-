import { Resend } from 'resend';

export const submitContactForm = async (req, res) => {
  try {
    const resend = (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder') 
      ? new Resend(process.env.RESEND_API_KEY) 
      : null;

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'jaylovelypriya@gmail.com';

    if (resend) {
      // 1. Send notification to Admin
      const adminRes = await resend.emails.send({
        from: 'onboarding@resend.dev', // Must use onboarding@resend.dev for unverified domains
        to: adminEmail,
        subject: `New Contact Request: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });
      
      if (adminRes.error) {
        console.error('Resend Admin Email Error:', adminRes.error);
        return res.status(500).json({ message: 'Failed to send admin email', error: adminRes.error });
      }

      // 2. Send confirmation to User
      const userRes = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'We received your message - Special Smile',
        html: `
          <h2>Thank you for contacting us, ${name}!</h2>
          <p>We have received your message regarding "<strong>${subject}</strong>".</p>
          <p>Our team will get back to you as soon as possible at this email address.</p>
          <p>Warm regards,<br>Special Smile Center</p>
        `
      });

      if (userRes.error) {
        console.error('Resend User Email Error:', userRes.error);
        // We don't fail the whole request if only the user confirmation fails,
        // because unverified domains on Resend can only send to the registered admin email.
      }
    } else {
      console.log('Resend is not configured. Mocking email sending.');
    }

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};
