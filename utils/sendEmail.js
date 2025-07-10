const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "jobankit99@gmail.com",
        pass: "khwh zctb dhns dcug",
      },
    });

    const info = await transporter.sendMail({
      from: `Tarya System <jobankit99@gmail.com>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error; // So calling function can catch it
  }
};

module.exports = sendEmail;
