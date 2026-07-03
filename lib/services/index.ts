import { SpaService } from '@/lib/types';
import { resolveServiceVideo } from '@/lib/service-videos';
import { SPA_SERVICES as esServices, FAQ_ITEMS as esFaq } from './es';
import { SPA_SERVICES as enServices, FAQ_ITEMS as enFaq } from './en';
import type { Locale } from '@/i18n/routing';

export const ALL_CATEGORY = '__all__';

function withServiceVideos(services: SpaService[]): SpaService[] {
  return services.map((service) => {
    const video = resolveServiceVideo(service.id);
    if (!video) return service;
    return { ...service, video };
  });
}

export function getSpaServices(locale: string): SpaService[] {
  return withServiceVideos(locale === 'en' ? enServices : esServices);
}

export function getFaqItems(locale: string) {
  return locale === 'en' ? enFaq : esFaq;
}

/** @deprecated Use getSpaServices(locale) */
export const SPA_SERVICES = withServiceVideos(esServices);

/** @deprecated Use getFaqItems(locale) */
export const FAQ_ITEMS = esFaq;

export function resolveLocale(locale?: string): Locale {
  return locale === 'en' ? 'en' : 'es';
}
