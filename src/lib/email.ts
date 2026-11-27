import nodemailer from "nodemailer";

// Logotipo completo oficial da Nuvi em branco (@3x Retina PNG em memória) para renderizar inline no topo do e-mail (compatível com Gmail/Outlook/Apple Mail)
const NUVI_LOGO_WHITE_PNG_BASE64 =
  "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";

function getEmailConfig() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || (user ? `"Nuvi" <${user}>` : "Nuvi <no-reply@nuvi.app>");
  return { host, port, user, pass, from };
}

function getLogoAttachment() {
  return {
    filename: "nuvi-logo.png",
    content: Buffer.from(NUVI_LOGO_WHITE_PNG_BASE64, "base64"),
    contentType: "image/png",
    contentDisposition: "inline" as const,
    cid: "nuvilogo",
  };
}

const BRAND_BLUE = "#4EA7EB";

/** Moldura comum dos e-mails: topo azul com o logótipo e cartão branco. */
function layoutHtml(title: string, inner: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title} - Nuvi</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F4F6F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4F6F9; padding: 32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #FFFFFF; border-radius: 22px; overflow: hidden; border: 1px solid #E5E7EB; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);">
              <tr>
                <td align="center" style="background-color: ${BRAND_BLUE}; padding: 28px 32px; text-align: center;">
                  <img src="cid:nuvilogo" alt="nuvi" width="141" height="26" style="display: block; margin: 0 auto; border: 0; outline: none; max-width: 141px; height: auto;" />
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 36px 32px 38px 32px; text-align: center;">
                  ${inner}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function wrapVerificationEmailHtml(code: string): string {
  const spacedCode = code.split("").join(" ");
  return layoutHtml(
    "Confirma o teu e-mail",
    `
      <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; color: #111827;">
        Confirma o teu e-mail
      </h1>
      <p style="margin: 0 0 28px 0; font-size: 14px; color: #6B7280; line-height: 1.5;">
        Usa este código para continuar na Nuvi
      </p>
      <div style="background-color: #F4F5F7; border-radius: 14px; padding: 26px 20px; text-align: center; margin: 0 0 28px 0;">
        <span style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace, sans-serif;">
          ${spacedCode}
        </span>
      </div>
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #6B7280;">
        Este código expira em 10 minutos.
      </p>
      <p style="margin: 0; font-size: 13px; color: #6B7280; line-height: 1.5;">
        Se não pediste este código, podes ignorar este e-mail.
      </p>
    `
  );
}

type SendResult = { success: boolean; previewUrl?: string; error?: string };

/** Envia por SMTP; em desenvolvimento sem SMTP usa uma conta de teste (Ethereal). */
async function deliver(
  mail: { to: string; subject: string; html: string; text: string },
  label: string,
  /** Linha extra para a consola em desenvolvimento (ex.: o código). */
  devNote = ""
): Promise<SendResult> {
  const { host, port, user, pass, from } = getEmailConfig();
  const message = { from, ...mail, attachments: [getLogoAttachment()] };

  if (user && pass) {
    try {
      const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
      const info = await transporter.sendMail(message);
      console.log(`[Nodemailer] ${label} enviado para:`, mail.to, info.messageId);
      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao enviar email";
      console.error(`[Nodemailer] Falha ao enviar ${label} para:`, mail.to, errorMessage);
      // O detalhe do SMTP fica nos logs; o utilizador recebe uma mensagem genérica.
      return { success: false, error: "Não foi possível enviar o e-mail. Tenta de novo daqui a pouco." };
    }
  }

  // Sem SMTP em produção: falha de forma explícita (nunca finge que enviou).
  if (process.env.NODE_ENV === "production") {
    console.error("[Nodemailer] SMTP_USER/SMTP_PASS não configurados em produção.");
    return { success: false, error: "O envio de e-mails não está disponível de momento." };
  }

  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    const info = await transporter.sendMail(message);
    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
    console.info(`[Nuvi ${label} - Teste] ${mail.to}${devNote}${previewUrl ? ` | Preview: ${previewUrl}` : ""}`);
    return { success: true, previewUrl };
  } catch {
    console.info(`[Nuvi ${label} - Local] ${mail.to}${devNote} (sem envio)`);
    return { success: true };
  }
}

export async function sendVerificationCodeEmail({ email, code }: { email: string; code: string }): Promise<SendResult> {
  return deliver(
    {
      to: email,
      subject: `${code} é o teu código da Nuvi`,
      html: wrapVerificationEmailHtml(code),
      text: `Confirma o teu e-mail\n\nUsa este código para continuar na Nuvi: ${code}\n\nEste código expira em 10 minutos.\nSe não pediste este código, podes ignorar este e-mail.`,
    },
    "Código de verificação",
    ` | código: ${code}`
  );
}

/* ---------------- Boas-vindas ---------------- */

const WELCOME = {
  marca: {
    title: "A tua marca está na Nuvi",
    lead: "A conta está pronta. Agora é contigo: lança a primeira campanha e recebe conteúdo de criadores.",
    steps: [
      ["Cria a primeira campanha", "Objetivo, público e orçamento em poucos minutos."],
      ["Recebe criadores", "Os criadores certos candidatam-se à tua campanha."],
      ["Aprova e paga em Kwanzas", "Só pagas o conteúdo que aprovares."],
    ],
    cta: "Abrir o painel",
    path: "/painel",
  },
  criador: {
    title: "Bem-vindo à Nuvi",
    lead: "A tua conta de criador está pronta. Vamos avisar-te quando houver campanhas para ti.",
    steps: [
      ["Completa o teu perfil", "Nicho, redes sociais e exemplos de conteúdo."],
      ["Recebe convites", "As marcas encontram-te em Descobrir."],
      ["Cria e recebe", "Pagamento em Kwanzas após aprovação."],
    ],
    cta: "Abrir a Nuvi",
    path: "/",
  },
} as const;

export function wrapWelcomeEmailHtml(role: "marca" | "criador", appUrl: string): string {
  const c = WELCOME[role];
  const steps = c.steps
    .map(
      ([t, d], i) => `
        <tr>
          <td valign="top" style="width: 36px; padding: 0 0 16px 0;">
            <div style="width: 28px; height: 28px; border-radius: 14px; background-color: #EAF5FD; color: ${BRAND_BLUE}; font-size: 13px; font-weight: 700; line-height: 28px; text-align: center;">${i + 1}</div>
          </td>
          <td valign="top" style="padding: 3px 0 16px 0; text-align: left;">
            <div style="font-size: 14px; font-weight: 600; color: #111827;">${t}</div>
            <div style="font-size: 13px; color: #6B7280; line-height: 1.5;">${d}</div>
          </td>
        </tr>`
    )
    .join("");
  return layoutHtml(
    c.title,
    `
      <div style="font-size: 40px; line-height: 1; margin: 0 0 14px 0;">🎉</div>
      <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.02em; color: #111827;">${c.title}</h1>
      <p style="margin: 0 0 28px 0; font-size: 14px; color: #6B7280; line-height: 1.6;">${c.lead}</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F9FC; border-radius: 16px; padding: 20px 20px 4px 20px; margin: 0 0 28px 0;">${steps}</table>
      <a href="${appUrl}${c.path}" style="display: inline-block; background-color: ${BRAND_BLUE}; color: #FFFFFF; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 999px;">${c.cta}</a>
      <p style="margin: 28px 0 0 0; font-size: 12px; color: #9CA3AF; line-height: 1.5;">Recebeste este e-mail porque criaste uma conta na Nuvi com este endereço.</p>
    `
  );
}

export async function sendWelcomeEmail({
  email,
  role,
  appUrl,
}: {
  email: string;
  role: "marca" | "criador";
  appUrl: string;
}): Promise<SendResult> {
  const c = WELCOME[role];
  const text = `${c.title}\n\n${c.lead}\n\n${c.steps.map(([t, d], i) => `${i + 1}. ${t} — ${d}`).join("\n")}\n\n${c.cta}: ${appUrl}${c.path}\n\nRecebeste este e-mail porque criaste uma conta na Nuvi com este endereço.`;
  return deliver({ to: email, subject: c.title, html: wrapWelcomeEmailHtml(role, appUrl), text }, "E-mail de boas-vindas");
}
