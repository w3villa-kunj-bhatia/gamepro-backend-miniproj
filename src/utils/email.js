exports.sendEmail = async ({ to, subject, html }) => {
  console.log("EMAIL SENT");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("Content:", html);
};
