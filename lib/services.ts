import { SpaService } from '@/lib/types';

export const SPA_SERVICES: SpaService[] = [
  {
    id: '1',
    name: 'Facial Rejuvenecedor Premium',
    category: 'Faciales & Rejuvenecimiento',
    image: '/media/skincare_treatment_1782918671588.jpg',
    duration: '90 minutos',
    price: '$120 USD',
    priceCents: 12000,
    benefits: ['Regeneración celular acelerada', 'Síntesis natural de colágeno', 'Hidratación profunda con ácido hialurónico', 'Disminución de líneas de expresión'],
    description: 'Nuestra firma de antienvejecimiento más cotizada. Un tratamiento facial intensivo que combina micro-needling, péptidos tensores y mascarilla oclusiva de colágeno puro. Ideal para restaurar la densidad, firmeza y luminosidad juvenil de tu piel.'
  },
  {
    id: '2',
    name: 'Limpieza Facial Profunda',
    category: 'Cuidado Facial',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop',
    duration: '75 minutos',
    price: '$85 USD',
    priceCents: 8500,
    benefits: ['Extracción minuciosa de impurezas', 'Efecto bactericida con alta frecuencia', 'Exfoliación ultrasónica suave', 'Regulación del exceso de sebo'],
    description: 'Renovación completa para tu rostro. Incluye vaporización con ozono para dilatar poros, peeling enzimático suave, extracción manual asistida, y mascarilla calmante personalizada de fitonutrientes que deja tu piel suave como seda.'
  },
  {
    id: '3',
    name: 'Corporal Reductor & Moldeador',
    category: 'Tratamientos Corporales',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1000&auto=format&fit=crop',
    duration: '60 minutos',
    price: '$95 USD',
    priceCents: 9500,
    benefits: ['Eliminación activa de toxinas', 'Estimulación del drenaje linfático', 'Modelado de silueta abdominal y piernas', 'Reducción visible de celulitis'],
    description: 'Combina masajes manuales de alta intensidad y maderoterapia localizada con cremas termogénicas enriquecidas con centella asiática. Ideal para redefinir el contorno corporal, tonificar la piel flácida y desinflamar el cuerpo.'
  },
  {
    id: '4',
    name: 'Facial Express Luminosidad',
    category: 'Cuidado Facial',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=1000&auto=format&fit=crop',
    duration: '45 minutos',
    price: '$65 USD',
    priceCents: 6500,
    benefits: ['Brillo radiante instantáneo', 'Eliminación del aspecto cansado', 'Aporte concentrado de Vitamina C', 'Nutrición exprés inmediata'],
    description: 'Diseñado para agendas exigentes. Un protocolo rápido pero altamente efectivo que purifica, exfolia ligeramente y aporta un shock de Vitamina C y antioxidantes que devuelve la vida y el resplandor a tu rostro antes de cualquier evento.'
  },
  {
    id: '5',
    name: 'Masaje Relajante Sensorial',
    category: 'Tratamientos Corporales',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop',
    duration: '60 minutos',
    price: '$90 USD',
    priceCents: 9000,
    benefits: ['Alivio profundo del estrés', 'Relajación de tensiones en espalda y cuello', 'Estimulación de la circulación sanguínea', 'Aromaterapia de grado terapéutico'],
    description: 'Una inmersión absoluta en el descanso. Disfruta de un masaje corporal fluido aplicando aceites tibios de lavanda y manzanilla, acompañados de técnicas de acupresión suaves para calmar tu mente y restaurar tu equilibrio emocional.'
  },
  {
    id: '6',
    name: 'Servicios de Notaría Pública',
    category: 'Notaría Oficial Florida',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1000&auto=format&fit=crop',
    duration: '15 minutos',
    price: 'Varía según trámite',
    priceCents: null,
    benefits: ['Notarización legal en Florida', 'Poderes, contratos y testamentos', 'Declaraciones juradas y cartas de viaje', 'Servicio rápido, formal y confiable'],
    description: 'Además de cuidar tu bienestar estético, Yoly cuenta con la certificación oficial de Notary Public del Estado de Florida. Realiza tus trámites legales, firmas de documentos, certificaciones y poderes notariales en un ambiente sofisticado, con la máxima confidencialidad y rapidez.'
  }
];

export const FAQ_ITEMS = [
  {
    question: "¿Qué tratamientos de rejuvenecimiento facial ofrece Yoly Studio?",
    answer: "Ofrecemos una variedad de tratamientos premium adaptados a tu tipo de piel. Entre ellos destaca nuestro Facial Rejuvenecedor Premium que combina micro-needling, péptidos tensores y colágeno de alta pureza, así como limpiezas profundas con peeling enzimático y masajes tensores faciales."
  },
  {
    question: "¿Qué cuidados debo tener antes y después de un tratamiento facial?",
    answer: "Antes de tu cita, evita la exposición solar directa prolongada y no uses ácidos o peelings abrasivos en casa. Después del tratamiento, es fundamental aplicar protector solar SPF 50+, mantener la piel hidratada y evitar el maquillaje pesado durante las primeras 24 horas para permitir que los poros absorban completamente los nutrientes."
  },
  {
    question: "¿Qué es y cómo funciona el Corporal Reductor y Moldeador?",
    answer: "Es un tratamiento no invasivo que combina masajes manuales de drenaje linfático, maderoterapia y aparatología estética. Ayuda a descomponer adipocitos de grasa localizada, movilizar toxinas hacia los canales de eliminación naturales, y tensar la piel para lucir una silueta más estilizada."
  },
  {
    question: "¿Qué tipo de servicios notariales (Notary Public) ofrece Yoly?",
    answer: "Yoly es Notary Public certificada en el Estado de Florida. Realizamos notarizaciones oficiales de documentos legales, incluyendo cartas de poder, testamentos, declaraciones juradas, contratos comerciales, formularios de inmigración y escrituras. Ofrecemos tanto atención en el estudio como opciones a domicilio."
  },
  {
    question: "¿Qué documentos debo presentar para notarizar un documento?",
    answer: "De acuerdo con las leyes de Florida, es indispensable presentar una identificación oficial con fotografía vigente (licencia de conducir, pasaporte o ID estatal). El documento a notarizar debe estar completo, sin secciones en blanco, y la persona firmante debe estar presente físicamente."
  },
  {
    question: "¿Cómo funciona el proceso de reserva y cancelación de citas?",
    answer: "Puedes pre-reservar tu espacio de manera 100% online seleccionando el servicio, la fecha y el horario que prefieras. Yoly confirmará tu espacio personalmente vía telefónica o WhatsApp. Si necesitas reprogramar o cancelar, te pedimos amablemente que nos avises con al menos 24 horas de anticipación."
  }
];
