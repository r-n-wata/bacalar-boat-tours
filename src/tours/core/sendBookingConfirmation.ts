"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Booking {
  name: string;
  email: string;
  tourTitle: string;
  date: string;
  numPeople: number;
  bookingId: string;
  verificationToken?: string;
  time: string;
}

export async function sendBookingConfirmation({
  name,
  email,
  tourTitle,
  date,
  numPeople,
  bookingId,
  verificationToken,
  time,
}: Booking) {
  const cancelLink = `http://localhost:3000/tours/booking/cancel-booking?id=${bookingId}`;
  const verificationUrl = verificationToken
    ? `http://localhost:3000/tours/booking/verify-booking?token=${verificationToken}`
    : null;

  const isVerification = Boolean(verificationToken);

  try {
    const result = await resend.emails.send({
      from: "Bacalar Tours <onboarding@resend.dev>",
      to: [email],
      subject: isVerification
        ? `Please Confirm Your Booking for "${tourTitle}"`
        : `Booking Confirmed: ${tourTitle}`,
      html: `
        <h2>Hi ${name},</h2>
        ${
          isVerification
            ? `<p>Thank you for booking <strong>${tourTitle}</strong>!</p>
               <p>To complete your booking, please confirm it by clicking the button below:</p>
               <a href="${verificationUrl}"
                  style="display:inline-block;padding:10px 16px;background-color:#0d9488;color:white;
                  text-decoration:none;border-radius:6px;font-weight:600;margin-top:20px;">
                  Confirm Booking
               </a>
               <p style="margin-top:12px;font-size:14px;color:#555;">
                  If you don’t confirm, your spot may be released.
               </p>`
            : `<p>Your booking is <strong>confirmed</strong>! 🎉</p>`
        }

        <h3 style="margin-top:30px;">Booking Details</h3>
        <ul style="line-height:1.6;">
          <li><strong>Tour:</strong> ${tourTitle}</li>
          <li><strong>Date:</strong> ${new Date(date).toLocaleDateString()}, ${time}</li>
          <li><strong>Guests:</strong> ${numPeople}</li>
        </ul>

        <hr style="margin:32px 0;" />

        <a href="${cancelLink}"
          style="display:inline-block;padding:10px 16px;background-color:#dc2626;color:white;
          text-decoration:none;border-radius:6px;font-weight:600;">
          Cancel Booking
        </a>
      `,
    });

    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { error: "Could not send email" };
  }
}
