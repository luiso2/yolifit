import { SpaService } from '@/lib/types';

const MASSAGE_IMAGE = '/media/masaje-relajacion.jpg';
const MASSAGE_DECONTRACTURANTE_IMAGE = '/media/masaje-descontracturante.jpg';
const MASSAGE_REDUCTIVO_IMAGE = '/media/masaje-reductivo.jpg';
const MADEROTERAPIA_IMAGE = '/media/maderoterapia.jpg';
const DEPILACION_CEJAS_IMAGE = '/media/depilacion-cejas.jpg';
const LAMINADO_CEJAS_IMAGE = '/media/laminado-cejas.jpg';
const LIFTING_PESTANAS_IMAGE = '/media/lifting-pestanas.jpg';
const DEPILACION_CERA_IMAGE = '/media/depilacion-cera.jpg';
const DRENAJE_LINFATICO_IMAGE = MASSAGE_DECONTRACTURANTE_IMAGE;
const FACIAL_IMAGE = '/media/limpieza-facial.jpg';
const LIMPIEZA_FACIAL_BASICS_IMAGE = '/media/limpieza-facial-basics.jpg';
const LIMPIEZA_FACIAL_PROFUNDA_IMAGE = '/media/limpieza-facial-profunda.jpg';
const LIMPIEZA_FACIAL_ACNEICA_IMAGE = '/media/limpieza-facial-acneica.jpg';
const LIMPIEZA_FACIAL_OXIGENANTE_IMAGE = '/media/limpieza-facial-oxigenante.jpg';
const LIMPIEZA_FACIAL_ANTIEDAD_IMAGE = '/media/limpieza-facial-antiedad.jpg';
const MASAJE_YOGA_FACIAL_IMAGE = '/media/masaje-yoga-facial.jpg';
const LIMPIEZA_FACIAL_HIDRATANTE_IMAGE = '/media/limpieza-facial-hidratante.jpg';
const LIMPIEZA_FACIAL_DESPIGMENTACION_IMAGE = '/media/limpieza-facial-despigmentacion.jpg';
const HIDRAFACIAL_IMAGE = '/media/hidrafacial.jpg';
const PLASMA_RPP_IMAGE = '/media/plasma-ric-plaquetas.jpg';
const PDRN_SALMON_IMAGE = '/media/pdrn-salmon.jpg';
const EXOSOMAS_IMAGE = '/media/exosomas.jpg';
const TRATAMIENTO_FACIAL_LUZ_LED_IMAGE = '/media/tratamiento-facial-luz-led.jpg';
const LIMPIEZA_FACIAL_PREMIUM_IMAGE = '/media/limpieza-facial-premium.jpg';

const consultPrice = {
  price: 'Consultar precio',
  priceCents: null as number | null,
};

export const SPA_SERVICES: SpaService[] = [
  {
    id: '1',
    name: 'Masaje Relajante',
    category: 'Masajes',
    image: MASSAGE_IMAGE,
    duration: '60 minutos',
    price: 'Desde $100',
    priceCents: 10000,
    benefits: ['Alivio de tensión muscular', 'Reducción del estrés', 'Mejora de la circulación', 'Sensación de bienestar general'],
    description: 'Masaje suave de ritmo lento con maniobras fluidas para relajar cuerpo y mente, ideal para liberar el estrés acumulado y recuperar la calma.',
  },
  {
    id: '2',
    name: 'Masaje Descontracturante',
    category: 'Masajes',
    image: MASSAGE_DECONTRACTURANTE_IMAGE,
    duration: '60 minutos',
    price: '$140',
    priceCents: 14000,
    benefits: ['Liberación de contracturas', 'Alivio de dolor muscular', 'Mayor movilidad', 'Descarga de zonas tensas'],
    description: 'Técnica de presión moderada a profunda enfocada en contracturas, nudos musculares y zonas de tensión en espalda, cuello y hombros.',
  },
  {
    id: '4',
    name: 'Masaje Reductivo',
    category: 'Masajes',
    image: MASSAGE_REDUCTIVO_IMAGE,
    duration: '90 minutos',
    ...consultPrice,
    benefits: ['Estimulación del metabolismo local', 'Modelado corporal', 'Reducción de retención de líquidos', 'Piel más firme'],
    description: 'Masaje de intensidad media-alta orientado a moldear la silueta, activar la circulación y apoyar procesos reductivos de forma no invasiva.',
  },
  {
    id: '5',
    name: 'Masaje Drenaje Linfático Detox',
    category: 'Masajes',
    image: DRENAJE_LINFATICO_IMAGE,
    duration: '90 minutos',
    price: '$160',
    priceCents: 16000,
    benefits: ['Eliminación de toxinas', 'Reducción de inflamación', 'Mejora de la circulación linfática', 'Sensación de ligereza'],
    description: 'Técnica manual suave y rítmica que estimula el sistema linfático para favorecer la eliminación de líquidos y toxinas acumuladas.',
  },
  {
    id: '6',
    name: 'Masaje Yoga Facial',
    category: 'Masajes',
    image: MASAJE_YOGA_FACIAL_IMAGE,
    duration: '45 minutos',
    price: '$100',
    priceCents: 10000,
    benefits: ['Tonificación facial natural', 'Lifting sin cirugía', 'Mejora del contorno', 'Relajación de expresión'],
    description: 'Rutina de masaje facial inspirada en técnicas de yoga facial para tonificar músculos, redefinir el óvalo y aportar luminosidad.',
  },
  {
    id: '7',
    name: 'Drenaje Linfático Post Operatorio',
    category: 'Masajes',
    image: DRENAJE_LINFATICO_IMAGE,
    duration: '90 minutos',
    ...consultPrice,
    benefits: ['Reducción de edemas', 'Recuperación postquirúrgica', 'Mejora de la cicatrización', 'Alivio de inflamación'],
    description: 'Protocolo especializado de drenaje linfático manual para apoyar la recuperación después de procedimientos quirúrgicos, con técnica segura y personalizada.',
  },
  {
    id: '8',
    name: 'Maderoterapia',
    category: 'Masajes',
    image: MADEROTERAPIA_IMAGE,
    duration: '90 minutos',
    ...consultPrice,
    benefits: ['Modelado corporal', 'Activación circulatoria', 'Reducción de celulitis', 'Tonificación de tejidos'],
    description: 'Tratamiento corporal con instrumentos de madera que combina masaje y modelado para esculpir, tonificar y mejorar el aspecto de la piel.',
  },
  {
    id: '9',
    name: 'Limpieza Facial Básica',
    category: 'Limpieza Facial',
    image: LIMPIEZA_FACIAL_BASICS_IMAGE,
    duration: '45 minutos',
    price: '$100',
    priceCents: 10000,
    benefits: ['Limpieza superficial', 'Piel fresca y equilibrada', 'Eliminación de impurezas', 'Preparación para el día a día'],
    description: 'Limpieza facial esencial para mantener la piel limpia, fresca y equilibrada. Ideal como mantenimiento regular.',
  },
  {
    id: '10',
    name: 'Limpieza Facial Profunda',
    category: 'Limpieza Facial',
    image: LIMPIEZA_FACIAL_PROFUNDA_IMAGE,
    duration: '75 minutos',
    price: '$140',
    priceCents: 14000,
    benefits: ['Extracción de impurezas', 'Poros depurados', 'Renovación celular', 'Piel más lisa y uniforme'],
    description: 'Protocolo completo de higiene facial con exfoliación, vaporización y extracción para renovar la piel en profundidad.',
  },
  {
    id: '11',
    name: 'Limpieza Facial Hidratante',
    category: 'Limpieza Facial',
    image: LIMPIEZA_FACIAL_HIDRATANTE_IMAGE,
    duration: '60 minutos',
    price: '$160',
    priceCents: 16000,
    benefits: ['Hidratación intensa', 'Restauración de la barrera cutánea', 'Suavidad inmediata', 'Piel confortable y luminosa'],
    description: 'Tratamiento facial enfocado en restaurar los niveles de hidratación con activos nutritivos y mascarillas reparadoras.',
  },
  {
    id: '12',
    name: 'Limpieza Facial Piel Acnéica',
    category: 'Limpieza Facial',
    image: LIMPIEZA_FACIAL_ACNEICA_IMAGE,
    duration: '75 minutos',
    ...consultPrice,
    benefits: ['Control de sebo', 'Acción antibacteriana', 'Poros desobstruidos', 'Mejora de brotes activos'],
    description: 'Limpieza facial diseñada para pieles con tendencia acneica, con enfoque en purificación, equilibrio y calma de la piel.',
  },
  {
    id: '13',
    name: 'Limpieza Facial Despigmentación',
    category: 'Limpieza Facial',
    image: LIMPIEZA_FACIAL_DESPIGMENTACION_IMAGE,
    duration: '75 minutos',
    ...consultPrice,
    benefits: ['Unificación del tono', 'Reducción de manchas', 'Piel más homogénea', 'Luminosidad renovada'],
    description: 'Tratamiento facial orientado a atenuar manchas y unificar el tono de la piel con activos despigmentantes de uso profesional.',
  },
  {
    id: '14',
    name: 'Limpieza Facial Antiedad',
    category: 'Limpieza Facial',
    image: LIMPIEZA_FACIAL_ANTIEDAD_IMAGE,
    duration: '75 minutos',
    ...consultPrice,
    benefits: ['Estímulo de colágeno', 'Mejora de firmeza', 'Suavizado de líneas finas', 'Rostro más juvenil'],
    description: 'Protocolo antiedad que combina limpieza, activos regeneradores y técnicas manuales para revitalizar y reafirmar la piel.',
  },
  {
    id: '15',
    name: 'Hidrafacial',
    category: 'Limpieza Facial',
    image: HIDRAFACIAL_IMAGE,
    duration: '60 minutos',
    price: '$160',
    priceCents: 16000,
    benefits: ['Limpieza con tecnología', 'Hidratación profunda', 'Brillo inmediato', 'Sin tiempo de recuperación'],
    description: 'Tratamiento facial con tecnología de hidrodermoabrasión que limpia, exfolia, extrae e hidrata en una sola sesión.',
  },
  {
    id: '16',
    name: 'Limpieza Facial Oxigenante',
    category: 'Limpieza Facial',
    image: LIMPIEZA_FACIAL_OXIGENANTE_IMAGE,
    duration: '60 minutos',
    price: '$170',
    priceCents: 17000,
    benefits: ['Oxigenación celular', 'Piel revitalizada', 'Aspecto descansado', 'Mayor vitalidad cutánea'],
    description: 'Facial que aporta oxígeno y nutrientes a la piel para devolverle energía, frescura y un aspecto más saludable.',
  },
  {
    id: '17',
    name: 'Limpieza Facial Premium',
    category: 'Limpieza Facial',
    image: LIMPIEZA_FACIAL_PREMIUM_IMAGE,
    duration: '90 minutos',
    ...consultPrice,
    benefits: ['Experiencia de lujo', 'Protocolo personalizado', 'Resultados visibles', 'Máximo confort y cuidado'],
    description: 'La experiencia facial más completa del estudio: limpieza profunda, activos de alta gama y ritual personalizado para resultados premium.',
  },
  {
    id: '18',
    name: 'Plasma Rico en Plaquetas',
    category: 'Tratamientos Avanzados',
    image: PLASMA_RPP_IMAGE,
    duration: '60 minutos',
    price: '$160',
    priceCents: 16000,
    benefits: ['Regeneración tisular', 'Estímulo de colágeno', 'Mejora de textura', 'Rejuvenecimiento natural'],
    description: 'Tratamiento avanzado con PRP que utiliza los factores de crecimiento de tu propia sangre para estimular la regeneración y calidad de la piel.',
  },
  {
    id: '19',
    name: 'PDRN de Salmón',
    category: 'Tratamientos Avanzados',
    image: PDRN_SALMON_IMAGE,
    duration: '60 minutos',
    ...consultPrice,
    benefits: ['Reparación celular', 'Hidratación profunda', 'Mejora de elasticidad', 'Piel más resistente'],
    description: 'Bioestimulador con polinucleótidos de salmón que favorece la reparación, hidratación y regeneración de la piel a nivel celular.',
  },
  {
    id: '20',
    name: 'Exosomas',
    category: 'Tratamientos Avanzados',
    image: EXOSOMAS_IMAGE,
    duration: '60 minutos',
    ...consultPrice,
    benefits: ['Regeneración avanzada', 'Comunicación celular', 'Antiedad de nueva generación', 'Piel renovada y luminosa'],
    description: 'Tratamiento de vanguardia con exosomas que potencian la regeneración cutánea, mejoran la calidad de la piel y aportan un efecto rejuvenecedor.',
  },
  {
    id: '21',
    name: 'Depilación con Cera',
    category: 'Depilación',
    image: DEPILACION_CERA_IMAGE,
    duration: '45 minutos',
    ...consultPrice,
    benefits: ['Piel suave y libre de vello', 'Resultados duraderos', 'Aplicación higiénica y precisa', 'Ideal para rostro y cuerpo'],
    description: 'Depilación profesional con cera tibia de alta calidad para eliminar el vello de forma efectiva, dejando la piel lisa, cuidada y con acabado impecable.',
  },
  {
    id: '22',
    name: 'Depilación de Cejas',
    category: 'Cejas y Rostro',
    image: DEPILACION_CEJAS_IMAGE,
    duration: '30 minutos',
    price: '$40',
    priceCents: 4000,
    benefits: ['Cejas definidas y simétricas', 'Eliminación precisa del vello', 'Acabado limpio y natural', 'Mirada más armoniosa'],
    description: 'Depilación profesional de cejas con cera o pinza, adaptada a la forma de tu rostro para lograr un perfil limpio, simétrico y natural.',
  },
  {
    id: '23',
    name: 'Laminado de Cejas',
    category: 'Cejas y Rostro',
    image: LAMINADO_CEJAS_IMAGE,
    duration: '45 minutos',
    price: '$90',
    priceCents: 9000,
    benefits: ['Cejas más pobladas visualmente', 'Efecto peinado y ordenado', 'Mayor definición', 'Resultado de larga duración'],
    description: 'Tratamiento de laminado de cejas que alisa, fija y da dirección al vello para lograr un look más lleno, estructurado y pulido durante semanas.',
  },
  {
    id: '25',
    name: 'Lifting de Pestañas',
    category: 'Cejas y Rostro',
    image: LIFTING_PESTANAS_IMAGE,
    duration: '60 minutos',
    price: '$80',
    priceCents: 8000,
    benefits: ['Pestañas más curvadas y abiertas', 'Mirada más intensa sin extensiones', 'Efecto natural y duradero', 'Sin necesidad de rizador diario'],
    description: 'Tratamiento de lifting de pestañas que eleva, curva y realza el vello natural para una mirada más abierta, definida y elegante durante semanas.',
  },
  {
    id: '24',
    name: 'Tratamiento Facial Luz LED',
    category: 'Tratamientos Avanzados',
    image: TRATAMIENTO_FACIAL_LUZ_LED_IMAGE,
    duration: '45 minutos',
    ...consultPrice,
    benefits: ['Estimulación celular', 'Mejora de luminosidad', 'Acción antiinflamatoria', 'Piel más uniforme y saludable'],
    description: 'Tratamiento facial con fototerapia LED que utiliza longitudes de luz específicas para estimular la piel, reducir inflamación y potenciar la regeneración cutánea.',
  },
];

export const FAQ_ITEMS = [
  {
    question: '¿Qué tipos de masajes ofrece YolyStudio?',
    answer: 'Ofrecemos masaje relajante, descontracturante, reductivo, drenaje linfático, yoga facial, drenaje linfático post operatorio y maderoterapia, siempre adaptados a tus necesidades.',
  },
  {
    question: '¿Qué limpiezas faciales están disponibles?',
    answer: 'Contamos con limpieza facial básica, profunda, hidratante, para piel acnéica, despigmentación, antiedad, oxigenante y premium, además de Hidrafacial.',
  },
  {
    question: '¿Qué tratamientos avanzados realizan?',
    answer: 'Aplicamos protocolos de alta gama como Plasma Rico en Plaquetas (PRP), PDRN de salmón y Exosomas para regeneración y rejuvenecimiento cutáneo.',
  },
  {
    question: '¿Qué cuidados debo tener antes y después de un tratamiento facial?',
    answer: 'Antes de tu cita, evita la exposición solar directa prolongada y no uses ácidos o peelings abrasivos en casa. Después del tratamiento, aplica protector solar SPF 50+, mantén la piel hidratada y evita maquillaje pesado durante las primeras 24 horas.',
  },
  {
    question: '¿Ofrecen depilación y servicios de cejas?',
    answer: 'Sí. Realizamos depilación con cera, depilación de cejas y laminado de cejas con técnicas profesionales adaptadas a cada rostro.',
  },
  {
    question: '¿Cómo funciona el proceso de reserva y cancelación de citas?',
    answer: 'Reserva tu cita en línea seleccionando el servicio, la fecha y el horario de tu preferencia. Tu cita será confirmada vía WhatsApp. Para cambios o cancelaciones, agradecemos un aviso con al menos 24 horas de anticipación.',
  },
];
