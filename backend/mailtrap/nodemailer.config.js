import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure the transporter
export const transporter = nodemailer.createTransport({
  service: "gmail", // Use "gmail" or another SMTP service provider
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD, // App password or OAuth token
  },
  logger: true, // Optional: Enable detailed logging
  debug: false, // Optional: Disable debug logging
});

// Unified email client for sending emails
export const mailtrapClient = {
  send: async ({
    from,
    to,
    subject,
    html,
    template_uuid,
    template_variables,
    category,
  }) => {
    try {
      // Handle dynamic templates
      let finalHtml = html || ""; // Fallback to empty string if `html` is undefined
      if (template_uuid && template_variables) {
        Object.keys(template_variables).forEach((key) => {
          const regex = new RegExp(`\\{${key}\\}`, "g");
          finalHtml = finalHtml.replace(regex, template_variables[key]);
        });
      }

      if (!finalHtml) {
        throw new Error(`No HTML content provided for the email.`);
      }

      // Prepare recipient emails
      const recipientEmails = to.map((recipient) => recipient.email).join(",");

      // Send the email
      const info = await transporter.sendMail({
        from: `${from.name} <${from.email}>`,
        to: recipientEmails,
        subject,
        html: finalHtml,
      });

      console.log(`[${category}] Email sent successfully: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`[${category}] Error sending email:`, error.message);
      throw new Error(`Error sending ${category} email: ${error.message}`);
    }
  },
};

// Define a reusable sender object
export const sender = {
  name: "Moodify",
  email: process.env.SMTP_EMAIL,
};
