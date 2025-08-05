"use server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
export async function sendOperatorNotification({
  operatorEmail,
  operatorName,
  tourTitle,
  date,
  time,
  numPeople,
  customerName,
  specialRequests,
}: {
  operatorEmail: string;
  operatorName: string;
  tourTitle: string;
  date: string;
  time: string;
  numPeople: number;
  customerName: string;
  specialRequests?: string;
}) {
  await resend.emails.send({
    from: "Bacalar Tours <onboarding@resend.dev>",
    to: operatorEmail,
    subject: `📣 New Booking for ${tourTitle}`,
    text: `Hi ${operatorName}, you have a new booking for ${tourTitle} on ${date} at ${time}.`,
    html: `
      <p>Hi ${operatorName},</p>
      <p>You have a new booking:</p>
      <ul>
        <li><strong>Tour:</strong> ${tourTitle}</li>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time:</strong> ${time}</li>
        <li><strong>Guests:</strong> ${numPeople}</li>
        <li><strong>Customer:</strong> ${customerName}</li>
        ${
          specialRequests
            ? `<li><strong>Special Requests:</strong> ${specialRequests}</li>`
            : ""
        }
      </ul>
      <p>Please check your dashboard for more details.</p>
    `,
  });
}
