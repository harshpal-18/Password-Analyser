
import { PasswordStrength, SecurityScore } from "../types";
import { COMMON_PASSWORDS } from "../constants";

export const calculateStrength = (password: string): SecurityScore => {
  if (!password) {
    return {
      score: 0,
      label: PasswordStrength.WEAK,
      entropy: 0,
      crackingTime: "Instantly",
      feedback: ["Enter a password to begin."],
      isCommon: false
    };
  }

  let score = 0;
  const feedback: string[] = [];
  let isCommon = false;
  
  // Length
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  else feedback.push("Try a longer password (12+ characters).");

  // Variety
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (hasLower) score += 10;
  if (hasUpper) score += 15;
  else feedback.push("Add uppercase letters.");
  
  if (hasNumber) score += 15;
  else feedback.push("Add numbers.");
  
  if (hasSpecial) score += 20;
  else feedback.push("Add special characters (!@#$).");

  // Deductions for common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    score = 2; // Drastic drop
    isCommon = true;
    feedback.unshift("DANGER: This password is in the 'Top 100 Most Used' list. Change it immediately.");
  }

  // Entropy Calculation
  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSpecial) poolSize += 32;
  
  const entropy = poolSize > 0 ? Math.floor(password.length * Math.log2(poolSize)) : 0;
  
  // Cracking Time Estimation
  let crackingTime = "Seconds";
  if (entropy > 80 && !isCommon) crackingTime = "Centuries";
  else if (entropy > 60 && !isCommon) crackingTime = "Decades";
  else if (entropy > 50 && !isCommon) crackingTime = "Years";
  else if (entropy > 40 && !isCommon) crackingTime = "Months";
  else if (entropy > 30 && !isCommon) crackingTime = "Days";
  else if (entropy > 25 && !isCommon) crackingTime = "Hours";
  else if (isCommon) crackingTime = "Instantly (Known)";

  let label = PasswordStrength.WEAK;
  if (score >= 80 && !isCommon) label = PasswordStrength.VERY_STRONG;
  else if (score >= 60 && !isCommon) label = PasswordStrength.STRONG;
  else if (score >= 40 && !isCommon) label = PasswordStrength.MEDIUM;

  return {
    score: Math.min(score, 100),
    label,
    entropy,
    crackingTime,
    feedback: feedback.length > 0 ? feedback : ["Excellent security hygiene!"],
    isCommon
  };
};
