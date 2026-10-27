import { validateContactForm } from "../../lib/contactFormValidation";
import { sendContactConfirmationEmail } from "../../lib/sendContactEmail";

export const runtime = "nodejs";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const values = {
    name: typeof body.name === "string" ? body.name : "",
    email: typeof body.email === "string" ? body.email : "",
    subject: typeof body.subject === "string" ? body.subject : "",
    message: typeof body.message === "string" ? body.message : "",
  };

  const errors = validateContactForm(values);
  if (Object.keys(errors).length > 0) {
    return Response.json(
      { error: "Validation failed.", fieldErrors: errors },
      { status: 400 },
    );
  }

  const payload = {
    name: values.name.trim(),
    email: values.email.trim(),
    subject: values.subject,
    message: values.message.trim(),
  };

  try {
    await sendContactConfirmationEmail(payload);
    return Response.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not send email.";
    const isConfig = message.includes("not configured");

    return Response.json(
      { error: message },
      { status: isConfig ? 503 : 502 },
    );
  }
}
