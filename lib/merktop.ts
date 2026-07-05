// Public Merktop worker base + Yoly's business id. Both are public (the id
// appears in gift-card codes / pay URLs), so a constant default is fine; env
// vars can override per environment without a code change.
export const MERKTOP_WORKER_URL =
  process.env.MERKTOP_WORKER_URL ?? 'https://merktop-payments.odd-forest-9504.workers.dev';

export const MERKTOP_BUSINESS_ID =
  process.env.MERKTOP_BUSINESS_ID ?? '5982fadb-48aa-4119-bc18-a61db8733d70';
