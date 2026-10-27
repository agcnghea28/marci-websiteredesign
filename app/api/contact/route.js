import { validateContactForm } from "../../lib/contactFormValidation";

export const runtime = "nodejs";

/** Demo contact endpoint — validates payload only; never sends email. */
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

  return Response.json({ ok: true, demo: true });
}
