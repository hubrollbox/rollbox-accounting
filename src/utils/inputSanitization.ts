
import DOMPurify from 'dompurify';

/**
 * Sanitiza entrada de texto removendo tags HTML e scripts maliciosos
 */
export const sanitizeText = (input: string): string => {
  return DOMPurify.sanitize((input || "").trim(), { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
};

/**
 * Sanitiza entrada de email
 */
export const sanitizeEmail = (email: string): string => {
  const sanitized = sanitizeText(email);
  // Validação básica de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
};

/**
 * Sanitiza e valida NIF português
 */
export const sanitizeAndValidateNIF = (nif: string): { value: string; isValid: boolean } => {
  const sanitized = sanitizeText(nif).replace(/\D/g, ''); // Remove tudo exceto dígitos
  
  if (sanitized.length !== 9) {
    return { value: sanitized, isValid: false };
  }

  // Validação de checksum do NIF português
  const checkDigit = parseInt(sanitized[8]);
  const weights = [9, 8, 7, 6, 5, 4, 3, 2];
  
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(sanitized[i]) * weights[i];
  }
  
  const remainder = sum % 11;
  const expectedCheckDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return { 
    value: sanitized, 
    isValid: checkDigit === expectedCheckDigit 
  };
};

/**
 * Limita o comprimento de strings de entrada
 */
export const limitInputLength = (input: string, maxLength: number): string => {
  return sanitizeText(input).substring(0, maxLength);
};

/**
 * Sanitiza entrada numérica
 */
export const sanitizeNumeric = (input: string, allowDecimals: boolean = true): string => {
  const sanitized = sanitizeText(input);
  const regex = allowDecimals ? /[^0-9.,]/g : /[^0-9]/g;
  return sanitized.replace(regex, '');
};

/**
 * Remove caracteres perigosos de SQL
 */
export const sanitizeForDatabase = (input: string): string => {
  const sanitized = sanitizeText(input);
  // Remove caracteres que podem ser usados para SQL injection
  return sanitized.replace(/['";\\-]/g, '');
};
