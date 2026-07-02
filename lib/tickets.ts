export function generateTicketCode(date: Date, random: () => number = Math.random): string {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const num = Math.floor(1000 + random() * 9000);
  return `YS-${dateStr}-${num}`;
}

export function ticketFromSessionId(sessionId: string, dateISO: string): string {
  const dateStr = dateISO.replace(/-/g, '');
  const suffix = sessionId.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();
  return `YS-${dateStr}-${suffix}`;
}
