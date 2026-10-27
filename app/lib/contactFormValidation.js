export function validateContactForm(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();

  if (!name) {
    errors.name = "Please enter your name.";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.subject) {
    errors.subject = "Please choose a subject.";
  }

  if (values.message.trim().length < 10) {
    errors.message = "Please enter a message of at least 10 characters.";
  }

  return errors;
}
