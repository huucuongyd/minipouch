import nodemailer from "nodemailer";
import { site } from "@/lib/site";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  product: string;
  message: string;
};

function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
  );
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendContactEmail(payload: ContactPayload) {
  const to = process.env.MAIL_TO || process.env.SMTP_USER || site.email;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER || site.email;
  const subject = `[NuBeNa] Liên hệ mới từ ${payload.name}`;
  const text = [
    `Tên: ${payload.name}`,
    `Email: ${payload.email}`,
    `Điện thoại: ${payload.phone || "—"}`,
    `Sản phẩm quan tâm: ${payload.product || "—"}`,
    "",
    payload.message,
  ].join("\n");

  const html = `
    <div style="font-family:Georgia,serif;background:#F7F0E8;padding:24px;color:#2C2420;">
      <h2 style="margin:0 0 8px;">NuBeNa — lời nhắn mới</h2>
      <p style="margin:0 0 20px;color:#6E615A;">Có khách vừa gửi form liên hệ.</p>
      <table style="width:100%;border-collapse:collapse;background:#FFFBF7;border-radius:16px;">
        <tr><td style="padding:10px 16px;color:#6E615A;">Tên</td><td style="padding:10px 16px;">${escapeHtml(payload.name)}</td></tr>
        <tr><td style="padding:10px 16px;color:#6E615A;">Email</td><td style="padding:10px 16px;">${escapeHtml(payload.email)}</td></tr>
        <tr><td style="padding:10px 16px;color:#6E615A;">Điện thoại</td><td style="padding:10px 16px;">${escapeHtml(payload.phone || "—")}</td></tr>
        <tr><td style="padding:10px 16px;color:#6E615A;">Sản phẩm</td><td style="padding:10px 16px;">${escapeHtml(payload.product || "—")}</td></tr>
      </table>
      <p style="white-space:pre-wrap;background:#FFFBF7;padding:16px;border-radius:16px;margin-top:16px;">${escapeHtml(payload.message)}</p>
    </div>
  `;

  if (!isSmtpConfigured()) {
    console.info("[NuBeNa] SMTP chưa cấu hình. Nội dung form:", payload);
    return { sent: false as const };
  }

  const transport = createTransport();
  await transport.sendMail({
    from: `"NuBeNa" <${from}>`,
    to,
    replyTo: payload.email,
    subject,
    text,
    html,
  });

  return { sent: true as const };
}
