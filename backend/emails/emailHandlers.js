import { resendClient, sender } from "../lib/resend.js";
import {
  createWelcomeEmailTemplate,
  updateEmailTemplate,
} from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  console.log(`Sending welcome email to ${email} from ${sender.email}`);
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Birdie! 🐦",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Welcome email sent successfully:", data);
};

export const sendEmailChangeNotification = async (
  email,
  name,
  username,
  clientURL
) => {
  console.log(
    `Sending email change notification to ${email} from ${sender.email}`
  );

  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: `Email Sucessfully Changed for ${username}! 🐦`,
    html: updateEmailTemplate(name, username, clientURL),
  });

  if (error) {
    console.error("Error sending email change notification:", error);
    throw new Error("Failed to send email change notification");
  }

  console.log("Email change notification sent successfully:", data);
};
