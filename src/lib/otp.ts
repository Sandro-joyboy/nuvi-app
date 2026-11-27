import crypto from "crypto";

// Chave só para desenvolvimento local. Nunca é usada em produção.
const DEV_FALLBACK_SECRET = "nuvi-dev-otp-secret-change-in-production";
const PLACEHOLDER_SECRETS = new Set([
  DEV_FALLBACK_SECRET,
  "troque-por-uma-chave-secreta-segura", // valor do .env.example
]);
const MIN_SECRET_LENGTH = 32;

/**
 * Lida no momento do uso (não no import) para não partir o `next build`.
 * Em produção exige OTP_SECRET real: sem ela, qualquer pessoa com a chave
 * pública do repositório poderia forjar códigos válidos.
 */
function getOtpSecret(): string {
  const secret = process.env.OTP_SECRET?.trim();
  if (process.env.NODE_ENV !== "production") {
    return secret || DEV_FALLBACK_SECRET;
  }
  if (!secret || PLACEHOLDER_SECRETS.has(secret) || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `OTP_SECRET em falta ou inválida. Define uma chave aleatória com pelo menos ${MIN_SECRET_LENGTH} caracteres (ex.: openssl rand -base64 48).`
    );
  }
  return secret;
}

export const OTP_COOKIE_NAME = "nuvi_otp_token";
export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutos

interface OtpPayload {
  email: string;
  codeHash: string;
  exp: number;
}

export function generateSixDigitCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashCode(email: string, code: string): string {
  return crypto
    .createHmac("sha256", getOtpSecret())
    .update(`${email.toLowerCase().trim()}:${code}`)
    .digest("hex");
}

function signData(encodedPayload: string): string {
  return crypto
    .createHmac("sha256", getOtpSecret())
    .update(encodedPayload)
    .digest("base64url");
}

export function createOtpToken(email: string, code: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  const payload: OtpPayload = {
    email: normalizedEmail,
    codeHash: hashCode(normalizedEmail, code),
    exp: Date.now() + OTP_TTL_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );
  const signature = signData(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyOtpToken(
  token: string,
  email: string,
  code: string
): { valid: boolean; reason?: string } {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) {
      return { valid: false, reason: "Código inválido. Pede um novo." };
    }

    const [encodedPayload, providedSignature] = parts;
    const expectedSignature = signData(encodedPayload);

    const sigBufA = Buffer.from(providedSignature);
    const sigBufB = Buffer.from(expectedSignature);
    if (
      sigBufA.length !== sigBufB.length ||
      !crypto.timingSafeEqual(sigBufA, sigBufB)
    ) {
      return { valid: false, reason: "Código inválido. Pede um novo." };
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as OtpPayload;

    if (Date.now() > payload.exp) {
      return { valid: false, reason: "O código expirou. Pede um novo." };
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (payload.email !== normalizedEmail) {
      return { valid: false, reason: "Este código não é para este e-mail." };
    }

    const expectedHash = hashCode(normalizedEmail, code.trim());
    const hashBufA = Buffer.from(payload.codeHash);
    const hashBufB = Buffer.from(expectedHash);

    if (
      hashBufA.length !== hashBufB.length ||
      !crypto.timingSafeEqual(hashBufA, hashBufB)
    ) {
      return { valid: false, reason: "Código incorreto. Confirma e tenta de novo." };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: "Não foi possível validar o código." };
  }
}
