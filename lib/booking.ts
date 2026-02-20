import { PROFILE } from "./profile";

export function buildBookingText(params: {
  name?: string;
  service?: string;
  date?: string;
  note?: string;
}) {
  const lines = [
    "Здравствуйте! Хочу записаться на процедуру.",
    params.name ? `Имя: ${params.name}` : null,
    params.service ? `Услуга: ${params.service}` : null,
    params.date ? `Дата/время: ${params.date}` : null,
    params.note ? `Комментарий: ${params.note}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export function buildWhatsAppUrl(text: string) {
  const encoded = encodeURIComponent(text);
  const digits = PROFILE.phoneRaw.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encoded}`;
}