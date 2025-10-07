import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  if (!process.env.EMAIL_ENABLED || process.env.EMAIL_ENABLED !== 'true') {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Helper function to send actual email
const sendActualEmail = async (to, subject, text) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('Email sending disabled. Would send:', { to, subject });
    return { success: true, message: 'Email disabled' };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'FindIt App <noreply@findit.com>',
      to: to,
      subject: subject,
      text: text,
      html: text.replace(/\n/g, '<br>') // Simple HTML conversion
    });

    console.log('✅ Email sent successfully:', {
      messageId: info.messageId,
      to: to,
      subject: subject
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

// Simple notification logger that replaces email functionality
const sendMatchNotification = async (recipient, sender, item) => {
  console.log('Match notification (email disabled):', {
    event: 'match_notification',
    recipient: recipient?.email,
    sender: sender?.email,
    item: {
      name: item?.name,
      category: item?.category,
      status: item?.status
    }
  });
  return { success: true, message: 'Email notifications are disabled' };
};

// New function to send email when someone claims/responds to a post
const sendClaimNotification = async (itemOwner, claimant, item, message, isClaimingMatch = false) => {
  const notificationType = isClaimingMatch ? 'match_claim' : 'general_response';
  
  // Create email content
  const emailSubject = isClaimingMatch 
    ? `Someone claimed a match for your ${item.category.toLowerCase()} item: ${item.name}`
    : `New response on your ${item.category.toLowerCase()} item: ${item.name}`;
    
  const emailBody = `Hi ${itemOwner.name},

${claimant.name} has ${isClaimingMatch ? 'claimed a match' : 'responded'} to your ${item.category.toLowerCase()} item "${item.name}".

Message: "${message}"

Item Location: ${item.location}

Claimant Details:
- Name: ${claimant.name}
- Email: ${claimant.email}

Please log in to your FindIt account to view and manage this ${isClaimingMatch ? 'claim' : 'response'}.

Best regards,
FindIt Team`;

  // Log the notification for debugging
  console.log(`📧 ${notificationType.toUpperCase()} notification:`, {
    event: notificationType,
    itemOwner: {
      name: itemOwner?.name,
      email: itemOwner?.email
    },
    claimant: {
      name: claimant?.name,
      email: claimant?.email
    },
    item: {
      name: item?.name,
      category: item?.category,
      location: item?.location
    },
    timestamp: new Date().toISOString()
  });

  // Send actual email
  const result = await sendActualEmail(itemOwner.email, emailSubject, emailBody);
  
  if (result.success) {
    console.log(`✅ ${isClaimingMatch ? 'Match claim' : 'Response'} notification sent successfully`);
  } else {
    console.error(`❌ Failed to send ${isClaimingMatch ? 'match claim' : 'response'} notification:`, result.error);
  }
  
  return result;
};

export { sendMatchNotification, sendClaimNotification };