const nodemailer = require("nodemailer");

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const isSecure = process.env.EMAIL_PORT == 465;
    console.log(
      `Attempting email with User: ${process.env.EMAIL_USER}, Port: ${process.env.EMAIL_PORT}, Secure: ${isSecure}`,
    );

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: isSecure,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from:
        process.env.EMAIL_FROM || '"GamePro Support" <no-reply@gamepro.com>',
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
