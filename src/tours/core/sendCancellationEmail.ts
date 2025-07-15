"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface CancelledBooking {
  name: string;
  email: string;
  tourTitle: string;
  date: string;
  numPeople: number;
  bookingId: string;
}

export async function sendCancellationEmail({
  name,
  email,
  tourTitle,
  date,
  numPeople,
  bookingId,
}: CancelledBooking) {
  try {
    const result = await resend.emails.send({
      from: "Bacalar Tours <onboarding@resend.dev>",
      to: [email],
      subject: `Booking Cancelled: ${tourTitle}`,
      html: `
        <h2>Hi ${name},</h2>
        <p>Your booking for <strong>${tourTitle}</strong> on <strong>${new Date(
          date
        ).toLocaleString()}</strong> for <strong>${numPeople} guest(s)</strong> has been <span style="color: #dc2626; font-weight: 600;">cancelled</span>.</p>

        <p style="margin-top:16px;">If this was a mistake or you'd like to rebook, feel free to visit our site again and select a new date.</p>

        <h3 style="margin-top:30px;">Cancelled Booking Details</h3>
        <ul style="line-height:1.6;">
          <li><strong>Tour:</strong> ${tourTitle}</li>
          <li><strong>Date:</strong> ${new Date(date).toLocaleString()}</li>
          <li><strong>Guests:</strong> ${numPeople}</li>
          <li><strong>Booking ID:</strong> ${bookingId}</li>
        </ul>

        <p style="margin-top:30px;font-size:14px;color:#555;">
          We hope to see you again soon! 🌴
        </p>
      `,
    });

    return result;
  } catch (error) {
    console.error("❌ Error sending cancellation email:", error);
    return { error: "Could not send cancellation email" };
  }
}
