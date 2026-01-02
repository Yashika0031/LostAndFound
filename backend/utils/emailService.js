import nodemailer from 'nodemailer';

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
      html: text.replace(/\n/g, '<br>')
    });

    console.log('Email sent successfully:', {
      messageId: info.messageId,
      to: to,
      subject: subject
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

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

const sendClaimNotification = async (itemOwner, claimant, item, message, isClaimingMatch = false) => {
  const notificationType = isClaimingMatch ? 'match_claim' : 'general_response';
  
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

  const result = await sendActualEmail(itemOwner.email, emailSubject, emailBody);
  
  return result;
};

export { sendMatchNotification, sendClaimNotification };