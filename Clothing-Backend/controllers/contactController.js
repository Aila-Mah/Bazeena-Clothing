// controllers/contactController.js

const nodemailer = require('nodemailer');

const handleContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to admin
    const adminMailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    // Email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thanks for contacting Bazeena Clothing!',
      html: `
        <h4>Hello ${name},</h4>
        <p>Thank you for reaching out to <strong>Bazeena Clothing</strong>. We've received your message and will get back to you soon.</p>
        <p><strong>Your message:</strong></p>
        <blockquote>${message}</blockquote>
        <br/>
        <p>Best regards,<br/>Bazeena Support Team</p>
      `,
    };

    await transporter.sendMail(userMailOptions);

    res.status(200).json({ success: true, message: 'Emails sent successfully.' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ success: false, message: 'Error sending emails.' });
  }
};

module.exports = { handleContactForm };
