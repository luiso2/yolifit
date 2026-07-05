'use client';

import React, { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { parseAmountToCents } from '@/lib/gift-amount';

const GiftCardForm: React.FC = () => {
  const t = useTranslations('giftCards');

  const [amount, setAmount] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cents = parseAmountToCents(amount);
    if (cents < 500) {
      setError(t('errors.minAmount'));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/gift-cards/buy', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          amount: cents,
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          recipient_name: recipientName || null,
          recipient_email: recipientEmail || null,
          message: message || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.url) {
        window.location.href = data.url as string;
        return;
      }
      if (data?.error === 'not_ready') setError(t('errors.notReady'));
      else setError(t('errors.checkoutFailed'));
    } catch {
      setError(t('errors.connection'));
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    'w-full mt-2 px-4 py-3 rounded-xl bg-brand-cream border border-brand-bronze/25 text-brand-ink placeholder:text-brand-brown/40 focus:outline-none focus:border-brand-bronze transition-colors';
  const labelClass = 'block text-[11px] font-mono uppercase tracking-[0.18em] text-brand-brown';

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white/70 border border-brand-bronze/10 rounded-3xl p-6 md:p-8 shadow-sm backdrop-blur-md"
    >
      <p className="text-center text-[11px] font-mono uppercase tracking-[0.22em] text-brand-bronze mb-1">
        🎁 {t('page.title')}
      </p>
      <p className="text-center text-brand-brown/80 text-sm font-light mb-6">{t('page.subtitle')}</p>

      <label className={labelClass}>
        {t('form.amountLabel')}
        <input
          type="number" inputMode="decimal" min="5" step="1"
          value={amount} onChange={(e) => setAmount(e.target.value)}
          placeholder={t('form.amountPlaceholder')} required
          className={inputClass}
        />
      </label>
      <p className="text-xs text-brand-brown/60 mt-1.5 mb-5 font-light">{t('form.amountHint')}</p>

      <label className={labelClass}>
        {t('form.buyerName')}
        <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} required className={inputClass} />
      </label>
      <div className="h-4" />
      <label className={labelClass}>
        {t('form.buyerEmail')}
        <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} required className={inputClass} />
      </label>

      <div className="mt-6 pt-5 border-t border-brand-bronze/15">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-brown mb-3">{t('form.recipientTitle')}</p>
        <label className={labelClass}>
          {t('form.recipientName')}
          <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className={inputClass} />
        </label>
        <div className="h-4" />
        <label className={labelClass}>
          {t('form.recipientEmail')}
          <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className={inputClass} />
        </label>
        <div className="h-4" />
        <label className={labelClass}>
          {t('form.messageLabel')}
          <textarea
            value={message} onChange={(e) => setMessage(e.target.value)}
            maxLength={500} rows={3} placeholder={t('form.messagePlaceholder')}
            className={`${inputClass} resize-none`}
          />
        </label>
      </div>

      {error && (
        <p className="mt-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
      )}

      <button
        type="submit" disabled={busy}
        data-hover="true"
        className="mt-6 w-full py-4 rounded-full bg-brand-bronze text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-caramel transition-colors disabled:opacity-60 disabled:cursor-wait"
      >
        {busy ? t('form.submitting') : t('form.submit')}
      </button>

      <p className="text-center text-[10px] font-mono uppercase tracking-[0.2em] text-brand-brown/50 mt-4">
        Powered by <a href="https://merktop.com" className="underline">Merktop</a>
      </p>
    </form>
  );
};

export default GiftCardForm;
