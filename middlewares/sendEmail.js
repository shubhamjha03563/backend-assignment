const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${options.sellerName} <${options.sellerEmail}>`,
    to: options.clientEmail,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);
  console.log(`Message sent: ${info.messageId}`);
};

module.exports = sendEmail;
