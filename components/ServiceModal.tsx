'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar, Check, User, Mail, Phone } from 'lucide-react';
import { SpaService } from '@/lib/types';

interface ServiceModalProps {
  service: SpaService | null;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onNavigate }) => {
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Reset booking success whenever the displayed service changes (navigation),
  // and clear the full form once the modal is closed (service becomes null).
  useEffect(() => {
    if (!service) {
      setBookingName('');
      setBookingEmail('');
      setBookingPhone('');
      setBookingDate('');
      setBookingTime('');
    }
    setBookingSuccess(false);
  }, [service]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail || !bookingPhone || !bookingDate || !bookingTime) return;

    setIsSubmittingBooking(true);
    setTimeout(() => {
      setIsSubmittingBooking(false);
      setBookingSuccess(true);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/45 backdrop-blur-md cursor-auto overflow-y-auto"
        >
          {/* Viewport-fixed Close Button */}
          <button
            onClick={onClose}
            className="fixed top-4 right-4 md:top-6 md:right-6 z-[70] p-3 rounded-full bg-white/90 text-gray-800 hover:bg-black hover:text-white transition-all shadow-lg border border-black/[0.05] cursor-pointer flex items-center justify-center"
            data-hover="true"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Viewport-fixed Navigation Buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
            className="fixed left-2 md:left-6 top-1/2 -translate-y-1/2 z-[70] p-3 rounded-full bg-white/90 text-gray-800 hover:bg-brand-bronze hover:text-white transition-colors border border-black/[0.05] shadow-lg cursor-pointer flex items-center justify-center"
            data-hover="true"
            aria-label="Servicio anterior"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
            className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[70] p-3 rounded-full bg-white/90 text-gray-800 hover:bg-brand-bronze hover:text-white transition-colors border border-black/[0.05] shadow-lg cursor-pointer flex items-center justify-center"
            data-hover="true"
            aria-label="Siguiente servicio"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white border border-black/[0.08] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto text-brand-ink my-8"
          >
            {/* Image Side */}
            <div className="w-full md:w-1/2 h-48 md:h-auto relative overflow-hidden shrink-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={service.id}
                  src={service.image}
                  alt={service.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:bg-gradient-to-r md:from-transparent" />
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between relative bg-white">
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="flex items-center gap-2.5 text-brand-bronze mb-3">
                  <Calendar className="w-4 h-4" />
                  <span className="font-mono text-[10px] tracking-widest uppercase font-semibold">{service.category}</span>
                </div>

                <h3 className="text-2xl md:text-4xl font-heading font-normal text-gray-950 uppercase leading-tight mb-2">
                  {service.name}
                </h3>

                <div className="flex gap-4 items-center mb-4 text-xs font-mono text-gray-500 font-medium">
                  <span>⏳ {service.duration}</span>
                  <span>•</span>
                  <span className="text-brand-bronze">Valor: {service.price}</span>
                </div>

                <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-light mb-6">
                  {service.description}
                </p>

                <div className="mb-6">
                  <h5 className="text-[10px] font-mono tracking-widest text-brand-bronze font-semibold uppercase mb-2">Resultados esperados:</h5>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {service.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="text-xs text-gray-700 flex items-start gap-1.5 font-light leading-relaxed">
                        <Check className="w-4 h-4 text-brand-bronze shrink-0 mt-0.5" /> {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Interactive Cita Booking Form inside Modal */}
              <div className="border-t border-black/[0.05] pt-6 mt-4">
                <AnimatePresence mode="wait">
                  {!bookingSuccess ? (
                    <motion.form
                      key="booking-form"
                      onSubmit={handleBookingSubmit}
                      className="space-y-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-gray-800">Agendar Cita en Línea</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-gray-400"><User className="w-3.5 h-3.5" /></span>
                          <input
                            type="text"
                            required
                            placeholder="Tu nombre"
                            value={bookingName}
                            onChange={(e) => setBookingName(e.target.value)}
                            className="w-full bg-gray-50 border border-black/[0.05] rounded-lg pl-8 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-bronze"
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-gray-400"><Mail className="w-3.5 h-3.5" /></span>
                          <input
                            type="email"
                            required
                            placeholder="Tu correo"
                            value={bookingEmail}
                            onChange={(e) => setBookingEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-black/[0.05] rounded-lg pl-8 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-bronze"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                          <span className="absolute left-2.5 top-2.5 text-gray-400"><Phone className="w-3.5 h-3.5" /></span>
                          <input
                            type="tel"
                            required
                            placeholder="Tu teléfono"
                            value={bookingPhone}
                            onChange={(e) => setBookingPhone(e.target.value)}
                            className="w-full bg-gray-50 border border-black/[0.05] rounded-lg pl-8 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand-bronze"
                          />
                        </div>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="bg-gray-50 border border-black/[0.05] rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-brand-bronze w-full"
                        />
                      </div>

                      <div className="flex gap-2">
                        <select
                          required
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="flex-1 bg-gray-50 border border-black/[0.05] rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-brand-bronze"
                        >
                          <option value="">Selecciona horario</option>
                          <option value="9am">Mañana - 09:00 AM</option>
                          <option value="11am">Mañana - 11:00 AM</option>
                          <option value="2pm">Tarde - 02:00 PM</option>
                          <option value="4pm">Tarde - 04:00 PM</option>
                          <option value="6pm">Tarde - 06:00 PM</option>
                        </select>
                        <button
                          type="submit"
                          disabled={isSubmittingBooking}
                          className="px-6 bg-brand-bronze text-white font-bold uppercase text-[10px] tracking-widest hover:bg-brand-brown transition-colors rounded-lg font-heading disabled:opacity-50"
                        >
                          {isSubmittingBooking ? 'Registrando...' : 'Reservar'}
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="booking-success"
                      className="bg-brand-bronze/20 border border-brand-caramel/30 p-4 rounded-xl flex flex-col items-center text-center space-y-2"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-bronze text-white flex items-center justify-center font-bold">
                        <Check className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-heading font-bold text-gray-950 uppercase tracking-wider">¡Cita Solicitada!</h4>
                      <p className="text-xs text-gray-700 max-w-sm font-light">
                        Gracias <strong>{bookingName}</strong>, hemos recibido tu solicitud de cita previa para <strong>{service.name}</strong> el día <strong>{bookingDate}</strong> a las <strong>{bookingTime}</strong>. Yoly se pondrá en contacto contigo al <strong>{bookingPhone}</strong> para confirmar la cita.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ServiceModal;
