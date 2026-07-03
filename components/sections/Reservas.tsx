'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
  Check,
  Phone,
  FileText,
  User,
  Mail,
  CheckCircle2,
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { getSpaServices, ALL_CATEGORY } from '@/lib/services';
import { dateLocale } from '@/lib/i18n-utils';
import { SpaService } from '@/lib/types';

interface SuccessTicket {
  code: string;
  service: SpaService;
  date: Date;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export default function Reservas() {
  const t = useTranslations('reservas');
  const locale = useLocale();
  const spaServices = getSpaServices(locale);
  const MONTH_NAMES = t.raw('months') as string[];
  const DAYS_SHORT = t.raw('daysShort') as string[];

  // Calendar-based Reservation Center States
  const [calStep, setCalStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [calService, setCalService] = useState<SpaService>(spaServices[0]);
  const initialToday = new Date();
  const initialTodayDateObj = new Date(initialToday.getFullYear(), initialToday.getMonth(), initialToday.getDate());
  const [calDate, setCalDate] = useState<Date | null>(initialTodayDateObj); // Default pre-select today
  const [calMonth, setCalMonth] = useState(initialTodayDateObj.getMonth());
  const [calYear, setCalYear] = useState(initialTodayDateObj.getFullYear());
  const [calTime, setCalTime] = useState('10:30 AM');
  const [calName, setCalName] = useState('');
  const [calEmail, setCalEmail] = useState('');
  const [calPhone, setCalPhone] = useState('');
  const [calNotes, setCalNotes] = useState('');
  const [calSubmitting, setCalSubmitting] = useState(false);
  const [calSuccess, setCalSuccess] = useState(false);
  const [calSuccessTicket, setCalSuccessTicket] = useState<SuccessTicket | null>(null);
  const [calError, setCalError] = useState<string | null>(null);

  // Number of days in the current month
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  // First day of the month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  let firstDayIndex = new Date(calYear, calMonth, 1).getDay();
  // Adjust so 0 is Monday and 6 is Sunday
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const calendarDays: Array<{
    dayNum: number;
    isCurrentMonth: boolean;
    date: Date;
    isSunday?: boolean;
    isSaturday?: boolean;
    isPast?: boolean;
  }> = [];
  // Padding days from previous month
  const prevMonthDate = new Date(calYear, calMonth, 0);
  const prevMonthDaysCount = prevMonthDate.getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      dayNum: prevMonthDaysCount - i,
      isCurrentMonth: false,
      date: new Date(calYear, calMonth - 1, prevMonthDaysCount - i),
    });
  }

  // Days of current month
  const now = new Date();
  const todayDateObj = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(calYear, calMonth, i);
    const isPast = d < todayDateObj && d.toDateString() !== todayDateObj.toDateString();
    calendarDays.push({
      dayNum: i,
      isCurrentMonth: true,
      date: d,
      isSunday: d.getDay() === 0,
      isSaturday: d.getDay() === 6,
      isPast,
    });
  }

  // Next month padding days to make grid complete (multiple of 7)
  const totalSlotsUsed = calendarDays.length;
  const nextMonthPadding = 42 - totalSlotsUsed;
  for (let i = 1; i <= nextMonthPadding; i++) {
    calendarDays.push({
      dayNum: i,
      isCurrentMonth: false,
      date: new Date(calYear, calMonth + 1, i),
    });
  }

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((prev) => prev - 1);
    } else {
      setCalMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((prev) => prev + 1);
    } else {
      setCalMonth((prev) => prev + 1);
    }
  };

  // Get time slots based on selected date
  const getTimeSlots = (date: Date | null) => {
    if (!date) return [];
    const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
    if (dayOfWeek === 0) return []; // Sunday is Closed
    if (dayOfWeek === 6) {
      // Saturday is shorter
      return ['09:00 AM', '10:15 AM', '11:30 AM', '12:45 PM', '02:00 PM'];
    }
    // Weekdays
    return ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'];
  };

  const activeSlots = getTimeSlots(calDate);

  const handleCalBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calDate || !calTime || !calName || !calEmail || !calPhone) return;
    setCalSubmitting(true);
    setCalError(null);
    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          serviceId: calService.id,
          dateISO: calDate.toISOString().slice(0, 10),
          time: calTime,
          name: calName,
          email: calEmail,
          phone: calPhone,
          notes: calNotes || undefined,
          locale,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url; // Stripe Checkout
        return;
      }
      if (res.ok && data.ticket) {
        // Servicio sin pago online (notaría): ticket directo
        setCalSuccess(true);
        setCalSuccessTicket({
          code: data.ticket,
          service: calService,
          date: calDate,
          time: calTime,
          name: calName,
          email: calEmail,
          phone: calPhone,
          notes: calNotes,
        });
        return;
      }
      setCalError(data.error ?? t('errors.processFailed'));
    } catch {
      setCalError(t('errors.connection'));
    } finally {
      setCalSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6 md:mb-8">
        <p className="text-brand-bronze font-mono uppercase tracking-[0.25em] text-xs md:text-sm">
          {t('headline')}
        </p>
      </div>

      <AnimatePresence mode="wait">
          {calSuccess && calSuccessTicket ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
              key="success-ticket"
            >
              {/* Vintage Luxury Spa Ticket Pass */}
              <div className="relative bg-white border border-brand-bronze/20 rounded-3xl overflow-hidden shadow-2xl p-8 md:p-12 text-brand-ink">
                {/* Outer punched ticket holes (decorative) */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-brand-cream border-r border-y border-brand-bronze/20 rounded-r-full -translate-x-3 hidden md:block" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-12 bg-brand-cream border-l border-y border-brand-bronze/20 rounded-l-full translate-x-3 hidden md:block" />

                {/* Golden Header Accent */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-caramel via-brand-bronze to-brand-caramel" />

                <div className="flex flex-col items-center text-center mb-8 pb-6 border-b border-dashed border-brand-bronze/20">
                  <div className="w-16 h-16 bg-brand-bronze/10 rounded-full flex items-center justify-center text-brand-bronze mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-mono tracking-[0.3em] text-brand-caramel uppercase font-bold">
                    {t('ticketConfirmed')}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mt-1">{t('studioName')}</h3>
                  <p className="text-xs text-gray-500 mt-1">{t('studioTagline')}</p>
                </div>

                {/* Ticket Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-sm mb-8">
                  <div>
                    <span className="block text-[10px] font-mono text-brand-caramel uppercase tracking-wider mb-0.5">{t('client')}</span>
                    <span className="font-heading font-medium text-gray-900 text-base">{calSuccessTicket.name}</span>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {calSuccessTicket.email} • {calSuccessTicket.phone}
                    </p>
                  </div>

                  <div>
                    <span className="block text-[10px] font-mono text-brand-caramel uppercase tracking-wider mb-0.5">{t('treatment')}</span>
                    <span className="font-heading font-medium text-brand-bronze text-base">{calSuccessTicket.service.name}</span>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">
                      {calSuccessTicket.service.duration}
                    </p>
                  </div>

                  <div className="pt-4 md:pt-0 border-t md:border-t-0 border-black/[0.03]">
                    <span className="block text-[10px] font-mono text-brand-caramel uppercase tracking-wider mb-0.5">{t('selectedDate')}</span>
                    <span className="font-heading font-medium text-gray-900 text-base">
                      {calSuccessTicket.date.toLocaleDateString(dateLocale(locale), {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="pt-4 md:pt-0 border-t md:border-t-0 border-black/[0.03]">
                    <span className="block text-[10px] font-mono text-brand-caramel uppercase tracking-wider mb-0.5">{t('reservedTime')}</span>
                    <span className="font-heading font-medium text-gray-900 text-base flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-bronze" />
                      {calSuccessTicket.time}
                    </span>
                  </div>
                </div>

                {calSuccessTicket.notes && (
                  <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-black/[0.03] text-xs">
                    <span className="block text-[9px] font-mono text-gray-400 uppercase tracking-widest mb-1">{t('notesForYoly')}</span>
                    <p className="text-gray-600 italic font-light">&quot;{calSuccessTicket.notes}&quot;</p>
                  </div>
                )}

                {/* Decorative Barcode & Code */}
                <div className="flex flex-col items-center pt-6 border-t border-dashed border-brand-bronze/20">
                  <span className="text-[10px] font-mono text-brand-bronze tracking-[0.2em] uppercase font-bold mb-3">
                    {t('confirmationTicket')}
                  </span>

                  {/* Simulated vector barcode lines */}
                  <div className="flex items-center justify-center gap-0.5 h-12 opacity-85 px-4 bg-white">
                    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4].map((width, idx) => (
                      <div key={idx} className="bg-black h-full" style={{ width: `${width}px` }} />
                    ))}
                  </div>
                  <span className="font-mono text-xs text-gray-600 mt-2 tracking-widest">{calSuccessTicket.code}</span>
                </div>

                <div className="text-center mt-8 text-xs text-gray-500 leading-relaxed max-w-md mx-auto">
                  <p className="font-light">{t('ticketMessage')}</p>
                </div>

                {/* Print and Done Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 border border-brand-bronze/30 text-brand-bronze hover:bg-gray-50 transition-all font-heading text-xs tracking-widest uppercase rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4" /> {t('printTicket')}
                  </button>
                  <button
                    onClick={() => {
                      setCalSuccess(false);
                      setCalSuccessTicket(null);
                      setCalName('');
                      setCalEmail('');
                      setCalPhone('');
                      setCalNotes('');
                      setCalStep(1);
                      setSelectedCategory(ALL_CATEGORY);
                    }}
                    className="px-8 py-3.5 bg-brand-bronze text-white hover:bg-brand-brown transition-all font-heading text-xs tracking-widest uppercase rounded-lg shadow-md cursor-pointer"
                  >
                    {t('newBooking')}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div key="booking-form-wrapper" className="w-full">
              {/* 3-Step Elegant Indicator */}
              <div className="flex items-center justify-between max-w-xl mx-auto mb-6 md:mb-8 relative px-4">
                {/* Horizontal connecting background line */}
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gray-200/60 -translate-y-1/2 z-0" />

                {/* Active colored line */}
                <motion.div
                  className="absolute top-1/2 left-4 h-0.5 bg-brand-bronze -translate-y-1/2 z-0"
                  initial={{ width: '0%' }}
                  animate={{
                    width: calStep === 1 ? '0%' : calStep === 2 ? '50%' : '100%',
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />

                {/* Step 1 */}
                <button
                  type="button"
                  onClick={() => setCalStep(1)}
                  className="relative z-10 flex flex-col items-center gap-2 cursor-pointer focus:outline-none group bg-transparent border-none"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-heading text-xs transition-all duration-300 border
                      ${
                        calStep >= 1
                          ? 'bg-brand-bronze text-white border-brand-bronze scale-110 shadow-md shadow-brand-bronze/20 font-bold'
                          : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    {calStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-colors duration-300
                      ${calStep === 1 ? 'text-brand-bronze' : 'text-gray-400 group-hover:text-gray-600'}`}
                  >
                    {t('stepService')}
                  </span>
                </button>

                {/* Step 2 */}
                <button
                  type="button"
                  onClick={() => {
                    if (calService) setCalStep(2);
                  }}
                  disabled={!calService}
                  className={`relative z-10 flex flex-col items-center gap-2 cursor-pointer focus:outline-none group bg-transparent border-none
                    ${!calService ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-heading text-xs transition-all duration-300 border
                      ${
                        calStep >= 2
                          ? 'bg-brand-bronze text-white border-brand-bronze scale-110 shadow-md shadow-brand-bronze/20 font-bold'
                          : 'bg-white text-gray-400 border-gray-200'
                      }`}
                  >
                    {calStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-colors duration-300
                      ${calStep === 2 ? 'text-brand-bronze' : 'text-gray-400'}`}
                  >
                    {t('stepDateTime')}
                  </span>
                </button>

                {/* Step 3 */}
                <button
                  type="button"
                  onClick={() => {
                    if (calService && calDate && calTime) setCalStep(3);
                  }}
                  disabled={!calDate || !calTime}
                  className={`relative z-10 flex flex-col items-center gap-2 cursor-pointer focus:outline-none group bg-transparent border-none
                    ${!calDate || !calTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-heading text-xs transition-all duration-300 border
                      ${
                        calStep >= 3
                          ? 'bg-brand-bronze text-white border-brand-bronze scale-110 shadow-md shadow-brand-bronze/20 font-bold'
                          : 'bg-white text-gray-400 border-gray-200'
                      }`}
                  >
                    3
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-colors duration-300
                      ${calStep === 3 ? 'text-brand-bronze' : 'text-gray-400'}`}
                  >
                    {t('stepYourData')}
                  </span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {calStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/70 border border-brand-bronze/10 rounded-3xl p-5 md:p-8 shadow-xl backdrop-blur-md w-full"
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/[0.04]">
                      <div className="w-8 h-8 bg-brand-bronze text-white rounded-full flex items-center justify-center font-heading font-bold text-xs">
                        1
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-heading font-medium text-gray-900 tracking-tight">
                          {t('chooseService')}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono tracking-wider uppercase mt-0.5">
                          {t('step1of3')}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      {/* Category filter pills */}
                      <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                        {[ALL_CATEGORY, ...Array.from(new Set(spaServices.map((s) => s.category)))].map((cat) => {
                          const isSel = selectedCategory === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-4 py-2 rounded-full text-xs font-heading font-medium tracking-wider transition-all cursor-pointer border
                                ${
                                  isSel
                                    ? 'bg-brand-bronze border-brand-bronze text-white shadow-sm'
                                    : 'bg-white/80 border-black/[0.05] text-gray-600 hover:bg-brand-cream'
                                }`}
                            >
                              {cat === ALL_CATEGORY ? t('allServices') : cat}
                            </button>
                          );
                        })}
                      </div>

                      {/* Services responsive grid: compact + scrollable so the action bar never scrolls out of view */}
                      <div className="max-h-[52vh] overflow-y-auto pr-1 -mr-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {spaServices
                            .filter((s) => selectedCategory === ALL_CATEGORY || s.category === selectedCategory)
                            .map((service) => {
                            const isSelected = calService.id === service.id;
                            return (
                              <div
                                key={service.id}
                                onClick={() => {
                                  setCalService(service);
                                  // Auto-avanzar: selección fluida, sin necesidad de buscar el botón continuar
                                  setTimeout(() => setCalStep(2), 220);
                                }}
                                className={`group relative bg-brand-cream/80 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer flex gap-3 items-center p-3 hover:bg-white
                                  ${
                                    isSelected
                                      ? 'border-brand-bronze ring-2 ring-brand-bronze/10 shadow-lg shadow-brand-bronze/5 scale-[1.01]'
                                      : 'border-black/[0.04] shadow-sm hover:border-gray-300'
                                  }`}
                              >
                                <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden relative">
                                  {service.video ? (
                                    <video
                                      src={service.video}
                                      autoPlay
                                      muted
                                      loop
                                      playsInline
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  ) : (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img
                                      src={service.image}
                                      alt={service.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-heading font-bold text-gray-900 text-sm tracking-tight group-hover:text-brand-bronze transition-colors truncate">
                                      {service.name}
                                    </h4>
                                    <div
                                      className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center transition-all duration-300
                                        ${isSelected ? 'bg-brand-bronze text-white scale-110' : 'bg-gray-100 text-transparent group-hover:bg-gray-200'}`}
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </div>
                                  </div>
                                  <p className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mt-0.5 truncate">
                                    {service.category}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1.5">
                                    <span className="font-mono text-xs font-bold text-brand-bronze">{service.price}</span>
                                    <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                                      <Clock className="w-3 h-3" /> {service.duration}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom action bar: fallback manual control, selection above already auto-advances */}
                      <div className="pt-4 border-t border-black/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4 bg-brand-cream/50 p-4 rounded-2xl border border-black/[0.01]">
                        <div className="text-xs text-gray-600 font-medium">
                          {t('selected', { name: calService.name, price: calService.price })}
                        </div>
                        <button
                          type="button"
                          onClick={() => setCalStep(2)}
                          className="w-full sm:w-auto px-8 py-3.5 bg-brand-bronze hover:bg-brand-brown text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                        >
                          {t('continueToDateTime')} <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {calStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/70 border border-brand-bronze/10 rounded-3xl p-4 sm:p-8 shadow-xl backdrop-blur-md w-full"
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/[0.04]">
                      <div className="w-8 h-8 bg-brand-bronze text-white rounded-full flex items-center justify-center font-heading font-bold text-xs">
                        2
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-heading font-medium text-gray-900 tracking-tight">
                          {t('selectDateTime')}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono tracking-wider uppercase mt-0.5">
                          {t('step2of3')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left Column: Calendar (7 cols) */}
                      <div className="lg:col-span-7 w-full">
                        {/* Month Switcher */}
                        <div className="flex items-center justify-between bg-brand-cream border border-black/[0.03] px-3 sm:px-5 py-4 rounded-2xl mb-6">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-2 hover:bg-brand-bronze hover:text-white rounded-full text-brand-bronze transition-colors border-none cursor-pointer bg-transparent flex items-center justify-center"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <span className="font-heading font-bold text-xs sm:text-sm tracking-widest text-brand-bronze uppercase">
                            {MONTH_NAMES[calMonth]} {calYear}
                          </span>

                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-2 hover:bg-brand-bronze hover:text-white rounded-full text-brand-bronze transition-colors border-none cursor-pointer bg-transparent flex items-center justify-center"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="mb-6 w-full overflow-hidden">
                          {/* Weekday Headers */}
                          <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {DAYS_SHORT.map((day, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] md:text-xs font-mono font-bold tracking-widest text-brand-bronze/85 uppercase"
                              >
                                {day}
                              </span>
                            ))}
                          </div>

                          {/* Day Cells */}
                          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                            {calendarDays.map((cell, idx) => {
                              const isSelected = calDate && calDate.toDateString() === cell.date.toDateString();
                              const isToday = cell.date.toDateString() === todayDateObj.toDateString();

                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  disabled={!cell.isCurrentMonth || cell.isPast || cell.isSunday}
                                  onClick={() => {
                                    setCalDate(cell.date);
                                    const slots = getTimeSlots(cell.date);
                                    if (slots.length > 0) {
                                      setCalTime(slots[0]);
                                    }
                                  }}
                                  className={`aspect-square relative flex flex-col items-center justify-center rounded-xl transition-all duration-300 font-heading text-xs border-none cursor-pointer
                                    ${
                                      !cell.isCurrentMonth
                                        ? 'bg-transparent text-gray-300 pointer-events-none opacity-20'
                                        : cell.isSunday
                                          ? 'bg-red-50/20 text-red-300 cursor-not-allowed'
                                          : cell.isPast
                                            ? 'text-gray-300 line-through cursor-not-allowed bg-transparent'
                                            : isSelected
                                              ? 'bg-brand-bronze text-white font-bold shadow-md shadow-brand-bronze/20 scale-[1.03]'
                                              : 'bg-brand-cream/80 text-gray-800 hover:bg-brand-bronze/30 hover:text-brand-bronze'
                                    }
                                  `}
                                >
                                  <span>{cell.dayNum}</span>
                                  {isToday && cell.isCurrentMonth && !isSelected && (
                                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-brand-caramel rounded-full" />
                                  )}
                                  {cell.isSunday && cell.isCurrentMonth && (
                                    <span className="text-[8px] font-mono text-red-300 absolute bottom-0.5 hidden sm:block">
                                      {t('closed')}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Time Slot Selection (5 cols) */}
                      <div className="lg:col-span-5 w-full bg-brand-cream/30 p-4 sm:p-5 rounded-2xl border border-black/[0.02] self-stretch flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-mono text-brand-bronze uppercase tracking-widest mb-4 font-bold">
                            {t('availableSchedules')}
                          </h4>
                          {calDate ? (
                            calDate.getDay() === 0 ? (
                              <div className="p-4 bg-red-50/30 border border-red-100 rounded-xl text-center text-xs text-red-500 font-light">
                                {t('closedSunday')}
                              </div>
                            ) : activeSlots.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                                {activeSlots.map((slot, sIdx) => {
                                  const isTimeSelected = calTime === slot;
                                  return (
                                    <button
                                      key={sIdx}
                                      type="button"
                                      onClick={() => setCalTime(slot)}
                                      className={`py-3 text-xs font-heading tracking-wider rounded-xl transition-all border duration-300 cursor-pointer text-center
                                        ${
                                          isTimeSelected
                                            ? 'bg-brand-bronze border-brand-bronze text-white font-bold shadow-sm shadow-brand-bronze/10'
                                            : 'bg-white border-black/[0.05] text-gray-700 hover:bg-gray-50'
                                        }
                                      `}
                                    >
                                      {slot}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500 font-light italic text-center py-6">
                                {t('noSlots')}
                              </p>
                            )
                          ) : (
                            <div className="p-4 bg-amber-50/20 border border-amber-100/40 rounded-xl text-center text-xs text-amber-600 font-light italic">
                              {t('selectDayPrompt')}
                            </div>
                          )}
                        </div>

                        <div className="mt-8 bg-white border border-black/[0.04] p-4 rounded-xl text-[11px] text-gray-600 flex flex-col gap-1 shadow-xs">
                          <div className="font-heading font-medium text-gray-800">{t('serviceSummary')}</div>
                          <div className="text-xs font-bold text-gray-900 mt-0.5">{calService.name}</div>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-black/[0.03]">
                            <span className="font-mono text-[10px] text-gray-500">
                              {calService.duration} • {calService.priceCents !== null ? t('secureOnline') : t('payInStudio')}
                            </span>
                            <span className="font-mono text-xs text-brand-bronze font-bold">{calService.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-black/[0.04]">
                      <button
                        type="button"
                        onClick={() => setCalStep(1)}
                        className="px-6 py-3 border border-brand-bronze/30 text-brand-bronze hover:bg-gray-50 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-2 bg-transparent"
                      >
                        <ChevronLeft className="w-4 h-4" /> {t('back')}
                      </button>
                      <button
                        type="button"
                        disabled={!calDate || !calTime}
                        onClick={() => setCalStep(3)}
                        className={`px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center gap-2
                          ${
                            !calDate || !calTime
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                              : 'bg-brand-bronze hover:bg-brand-brown text-white cursor-pointer hover:shadow-lg hover:scale-[1.01]'
                          }`}
                      >
                        {t('continueToDetails')} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {calStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 15 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/70 border border-brand-bronze/10 rounded-3xl p-4 sm:p-8 shadow-xl backdrop-blur-md w-full"
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/[0.04]">
                      <div className="w-8 h-8 bg-brand-bronze text-white rounded-full flex items-center justify-center font-heading font-bold text-xs">
                        3
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-heading font-medium text-gray-900 tracking-tight">
                          {t('completeDetails')}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono tracking-wider uppercase mt-0.5">
                          {t('step3of3')}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleCalBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                      {/* Left Side: Form Details (7 cols) */}
                      <div className="lg:col-span-7 w-full space-y-4">
                        <div>
                          <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5 font-semibold">
                            {t('fullName')}
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-bronze opacity-70">
                              <User className="w-4 h-4" />
                            </span>
                            <input
                              type="text"
                              required
                              placeholder={t('namePlaceholder')}
                              value={calName}
                              onChange={(e) => setCalName(e.target.value)}
                              className="w-full bg-brand-cream border border-black/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-xs focus:outline-none focus:border-brand-bronze transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5 font-semibold">
                            {t('email')}
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-bronze opacity-70">
                              <Mail className="w-4 h-4" />
                            </span>
                            <input
                              type="email"
                              required
                              placeholder={t('emailPlaceholder')}
                              value={calEmail}
                              onChange={(e) => setCalEmail(e.target.value)}
                              className="w-full bg-brand-cream border border-black/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-xs focus:outline-none focus:border-brand-bronze transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5 font-semibold">
                            {t('phone')}
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-bronze opacity-70">
                              <Phone className="w-4 h-4" />
                            </span>
                            <input
                              type="tel"
                              required
                              placeholder={t('phonePlaceholder')}
                              value={calPhone}
                              onChange={(e) => setCalPhone(e.target.value)}
                              className="w-full bg-brand-cream border border-black/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-xs focus:outline-none focus:border-brand-bronze transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5 font-semibold">
                            {t('notesOptional')}
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-4.5 text-brand-bronze opacity-70">
                              <FileText className="w-4 h-4" />
                            </span>
                            <textarea
                              placeholder={t('notesPlaceholder')}
                              rows={3}
                              value={calNotes}
                              onChange={(e) => setCalNotes(e.target.value)}
                              className="w-full bg-brand-cream border border-black/[0.08] rounded-xl pl-11 pr-4 py-3.5 text-xs focus:outline-none focus:border-brand-bronze transition-all resize-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Side: Appointment Summary Ticket (5 cols) */}
                      <div className="lg:col-span-5 w-full bg-brand-cream border border-brand-bronze/15 rounded-3xl p-6 shadow-sm flex flex-col justify-between self-stretch">
                        <div>
                          <span className="block text-[10px] font-mono text-brand-caramel uppercase tracking-wider mb-3 font-bold">
                            {t('summaryTitle')}
                          </span>

                          {/* Service Details */}
                          <div className="pb-4 mb-4 border-b border-black/[0.04]">
                            <h4 className="font-heading font-bold text-gray-900 text-sm mb-1">{calService.name}</h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500 font-mono mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-brand-bronze" /> {calService.duration}
                              </span>
                              <span>{calService.category}</span>
                            </div>
                          </div>

                          {/* Date and Time Details */}
                          <div className="space-y-3 pb-4 mb-4 border-b border-black/[0.04]">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500">{t('chosenDate')}</span>
                              <span className="font-heading font-bold text-gray-800">
                                {calDate?.toLocaleDateString(dateLocale(locale), { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500">{t('appointmentTime')}</span>
                              <span className="font-heading font-bold text-brand-bronze flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-brand-bronze" /> {calTime}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-500">{t('totalPrice')}</span>
                              <span className="font-mono font-bold text-brand-bronze text-sm">{calService.price}</span>
                            </div>
                          </div>

                          {/* Trust & Policy Details */}
                          <div className="space-y-2 text-[10px] text-gray-500 leading-relaxed font-light">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-bronze shrink-0 mt-0.5" />
                              <span>{t('personalizedConfirmation')}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-bronze shrink-0 mt-0.5" />
                              <span>{t('freeCancellation')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-black/[0.03] space-y-3">
                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={calSubmitting || !calDate || !calTime || !calName || !calEmail || !calPhone}
                            className={`w-full py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 font-heading rounded-xl shadow-md border border-transparent
                              ${
                                calSubmitting
                                  ? 'bg-gray-100 text-gray-400 cursor-wait'
                                  : !calName || !calEmail || !calPhone
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-brand-bronze hover:bg-brand-brown text-white cursor-pointer hover:shadow-lg hover:scale-[1.01]'
                              }`}
                          >
                            {calSubmitting
                              ? t('verifying')
                              : calService.priceCents !== null
                                ? t('payAndBook', { price: calService.price })
                                : t('bookNowPrice', { price: calService.price })}
                          </button>

                          {calError && (
                            <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                              {calError}
                            </p>
                          )}

                          <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-gray-400 uppercase tracking-wider text-center">
                            <ShieldCheck className="w-4 h-4 text-brand-bronze" />
                            <span>
                              {calService.priceCents !== null ? t('secureOnline') : t('payInStudio')} • {t('encryptedConnection')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Navigation Inside Form */}
                      <div className="lg:col-span-12 flex justify-start items-center mt-6 pt-6 border-t border-black/[0.04]">
                        <button
                          type="button"
                          onClick={() => setCalStep(2)}
                          className="px-6 py-3 border border-brand-bronze/30 text-brand-bronze hover:bg-gray-50 text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-2 bg-transparent"
                        >
                          <ChevronLeft className="w-4 h-4" /> {t('backToDateTime')}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}
