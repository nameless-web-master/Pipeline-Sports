export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  // RFC 5322 compliant-ish email regex, good balance of strictness and practicality
  const emailRegex = /^(?:[a-zA-Z0-9_'^&+%`{}~!-]+(?:\.[a-zA-Z0-9_'^&+%`{}~!-]+)*)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

export default validateEmail;
