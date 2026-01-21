const axios = require("axios");

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const data = {
      sender: {
        email: process.env.EMAIL_FROM || "no-reply@gamepro.com",
        name: "GamePro",
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    };

    const config = {
      method: "post",
      url: "https://api.brevo.com/v3/smtp/email",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: data,
    };

    const response = await axios(config);
    console.log(
      "Email sent successfully via API. Message ID:",
      response.data.messageId,
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error sending email via API:",
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};
