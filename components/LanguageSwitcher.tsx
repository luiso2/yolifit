'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (next: 'es' | 'en') => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      className={`flex items-center gap-0.5 rounded-full border border-brand-bronze/25 bg-white/60 p-0.5 text-[10px] font-mono font-bold tracking-widest ${className}`}
      role="group"
      aria-label={locale === 'es' ? 'Idioma' : 'Language'}
    >
      <button
        type="button"
        onClick={() => switchLocale('es')}
        className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer border-none ${
          locale === 'es' ? 'bg-brand-bronze text-white' : 'bg-transparent text-gray-600 hover:text-brand-bronze'
        }`}
        data-hover="true"
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => switchLocale('en')}
        className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer border-none ${
          locale === 'en' ? 'bg-brand-bronze text-white' : 'bg-transparent text-gray-600 hover:text-brand-bronze'
        }`}
        data-hover="true"
      >
        EN
      </button>
    </div>
  );
}
