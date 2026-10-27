import nodemailer from "nodemailer";

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildContactConfirmationEmail({ name, email, subject, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Your message to Marci Metzger</title>
  </head>
  <body style="margin:0;padding:0;background:#f6f4f1;font-family:Georgia,'Times New Roman',serif;color:#2a2522;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f4f1;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e8e2db;border-radius:8px;">
            <tr>
              <td style="padding:28px 32px;">
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#8a7f76;">Marci Metzger · The Ridge Realty Group</p>
                <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;line-height:1.3;">We received your message</h1>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;color:#4a4541;">
                  Hi ${safeName}, thanks for reaching out. This is a copy of what you submitted on the website. Marci will follow up as soon as possible.
                </p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;">
                  <tr>
                    <td style="padding:10px 0;border-top:1px solid #ece6df;width:120px;vertical-align:top;color:#8a7f76;">Name</td>
                    <td style="padding:10px 0;border-top:1px solid #ece6df;vertical-align:top;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-top:1px solid #ece6df;vertical-align:top;color:#8a7f76;">Email</td>
                    <td style="padding:10px 0;border-top:1px solid #ece6df;vertical-align:top;">${safeEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-top:1px solid #ece6df;vertical-align:top;color:#8a7f76;">Subject</td>
                    <td style="padding:10px 0;border-top:1px solid #ece6df;vertical-align:top;">${safeSubject}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-top:1px solid #ece6df;vertical-align:top;color:#8a7f76;">Message</td>
                    <td style="padding:10px 0;border-top:1px solid #ece6df;vertical-align:top;">${safeMessage}</td>
                  </tr>
                </table>
                <p style="margin:24px 0 0;font-size:13px;line-height:1.5;font-family:Arial,Helvetica,sans-serif;color:#8a7f76;">
                  Temporary confirmation email — sent from the site contact form for testing.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `Hi ${name},

Thanks for reaching out. This is a copy of what you submitted:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Marci will follow up as soon as possible.

— Marci Metzger website (temporary test email)`;

  return {
    subject: `Copy of your message: ${subject}`,
    html,
    text,
  };
}

async function sendViaResend({ to, from, subject, html, text }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      text,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail =
      payload?.message ||
      payload?.error?.message ||
      "Resend could not send the email.";
    throw new Error(detail);
  }

  return payload;
}

async function sendViaSmtp({ to, from, subject, html, text }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number.parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
}

export async function sendContactConfirmationEmail(payload) {
  const { name, email, subject, message } = payload;
  const { subject: emailSubject, html, text } = buildContactConfirmationEmail({
    name,
    email,
    subject,
    message,
  });

  const from =
    process.env.CONTACT_FROM_EMAIL ||
    (process.env.SMTP_USER
      ? `"Marci Metzger" <${process.env.SMTP_USER}>`
      : null);

  if (!from) {
    throw new Error(
      "Email is not configured. Set CONTACT_FROM_EMAIL (Resend) or SMTP_USER (Gmail/SMTP).",
    );
  }

  if (process.env.RESEND_API_KEY) {
    await sendViaResend({
      to: email,
      from,
      subject: emailSubject,
      html,
      text,
    });
    return { provider: "resend" };
  }

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    await sendViaSmtp({
      to: email,
      from,
      subject: emailSubject,
      html,
      text,
    });
    return { provider: "smtp" };
  }

  throw new Error(
    "Email is not configured. Add RESEND_API_KEY or SMTP_USER and SMTP_PASS to .env.local.",
  );
}
