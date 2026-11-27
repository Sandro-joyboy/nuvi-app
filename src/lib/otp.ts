import crypto from "crypto";

const OTP_SECRET =
  process.env.OTP_SECRET || "nuvi-dev-otp-secret-change-in-production";

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
    .createHmac("sha256", OTP_SECRET)
    .update(`${email.toLowerCase().trim()}:${code}`)
    .digest("hex");
}

function signData(encodedPayload: string): string {
  return crypto
    .createHmac("sha256", OTP_SECRET)
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
      return { valid: false, reason: "Token inválido." };
    }

    const [encodedPayload, providedSignature] = parts;
    const expectedSignature = signData(encodedPayload);

    const sigBufA = Buffer.from(providedSignature);
    const sigBufB = Buffer.from(expectedSignature);
    if (
      sigBufA.length !== sigBufB.length ||
      !crypto.timingSafeEqual(sigBufA, sigBufB)
    ) {
      return { valid: false, reason: "Token adulterado." };
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as OtpPayload;

    if (Date.now() > payload.exp) {
      return { valid: false, reason: "O código expirou. Solicite um novo." };
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (payload.email !== normalizedEmail) {
      return { valid: false, reason: "E-mail não corresponde ao código." };
    }

    const expectedHash = hashCode(normalizedEmail, code.trim());
    const hashBufA = Buffer.from(payload.codeHash);
    const hashBufB = Buffer.from(expectedHash);

    if (
      hashBufA.length !== hashBufB.length ||
      !crypto.timingSafeEqual(hashBufA, hashBufB)
    ) {
      return { valid: false, reason: "Código incorreto. Tente novamente." };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: "Erro ao validar o código." };
  }
}
