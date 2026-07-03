import { SpaService } from '@/lib/types';

const MASSAGE_IMAGE = '/media/masaje-relajacion.jpg';
const MASSAGE_DECONTRACTURANTE_IMAGE = '/media/masaje-descontracturante.jpg';
const MASSAGE_REDUCTIVO_IMAGE = '/media/masaje-reductivo.jpg';
const MASSAGE_RELAJACION_IMAGE = '/media/masaje-relajacion-sesion.jpg';
const MADEROTERAPIA_IMAGE = '/media/maderoterapia.jpg';
const DEPILACION_CEJAS_IMAGE = '/media/depilacion-cejas.jpg';
const LAMINADO_CEJAS_IMAGE = '/media/laminado-cejas.jpg';
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

const askForPrice = {
  price: 'Ask for price',
  priceCents: null as number | null,
};

export const SPA_SERVICES: SpaService[] = [
  {
    id: '1',
    name: 'Relaxing Massage',
    category: 'Massages',
    image: MASSAGE_IMAGE,
    duration: '60 minutes',
    ...askForPrice,
    benefits: ['Muscle tension relief', 'Stress reduction', 'Improved circulation', 'Overall sense of well-being'],
    description: 'A gentle, slow-paced massage with fluid strokes to relax body and mind, ideal for releasing accumulated stress and restoring calm.',
  },
  {
    id: '2',
    name: 'Deep Tissue Massage',
    category: 'Massages',
    image: MASSAGE_DECONTRACTURANTE_IMAGE,
    duration: '60 minutes',
    ...askForPrice,
    benefits: ['Release of muscle knots', 'Relief from muscle pain', 'Greater mobility', 'Release of tense areas'],
    description: 'Moderate to deep pressure technique focused on knots, muscle tension, and tight areas in the back, neck, and shoulders.',
  },
  {
    id: '3',
    name: 'Relaxation Massage',
    category: 'Massages',
    image: MASSAGE_RELAJACION_IMAGE,
    duration: '60 minutes',
    ...askForPrice,
    benefits: ['Deep relaxation', 'Nervous system balance', 'Physical rest', 'Emotional well-being'],
    description: 'A full sensory relaxation experience with harmonious movements that promote physical and mental rest.',
  },
  {
    id: '4',
    name: 'Body Contouring Massage',
    category: 'Massages',
    image: MASSAGE_REDUCTIVO_IMAGE,
    duration: '90 minutes',
    ...askForPrice,
    benefits: ['Local metabolism stimulation', 'Body sculpting', 'Reduced fluid retention', 'Firmer skin'],
    description: 'Medium to high-intensity massage designed to sculpt the silhouette, activate circulation, and support non-invasive body contouring.',
  },
  {
    id: '5',
    name: 'Lymphatic Drainage Massage',
    category: 'Massages',
    image: DRENAJE_LINFATICO_IMAGE,
    duration: '90 minutes',
    ...askForPrice,
    benefits: ['Toxin elimination', 'Reduced inflammation', 'Improved lymphatic circulation', 'Light, refreshed feeling'],
    description: 'Gentle, rhythmic manual technique that stimulates the lymphatic system to help eliminate fluids and accumulated toxins.',
  },
  {
    id: '6',
    name: 'Facial Yoga Massage',
    category: 'Massages',
    image: MASAJE_YOGA_FACIAL_IMAGE,
    duration: '45 minutes',
    ...askForPrice,
    benefits: ['Natural facial toning', 'Non-surgical lifting effect', 'Improved facial contour', 'Relaxed expression'],
    description: 'Facial massage routine inspired by facial yoga techniques to tone muscles, redefine the jawline, and enhance radiance.',
  },
  {
    id: '7',
    name: 'Post-Operative Lymphatic Drainage',
    category: 'Massages',
    image: DRENAJE_LINFATICO_IMAGE,
    duration: '60 minutes',
    ...askForPrice,
    benefits: ['Reduced swelling', 'Post-surgical recovery support', 'Improved healing', 'Relief from inflammation'],
    description: 'Specialized manual lymphatic drainage protocol to support recovery after surgical procedures, with safe, personalized technique.',
  },
  {
    id: '8',
    name: 'Wood Therapy',
    category: 'Massages',
    image: MADEROTERAPIA_IMAGE,
    duration: '90 minutes',
    ...askForPrice,
    benefits: ['Body sculpting', 'Circulatory activation', 'Cellulite reduction', 'Tissue toning'],
    description: 'Body treatment using wooden instruments that combines massage and sculpting to shape, tone, and improve skin appearance.',
  },
  {
    id: '9',
    name: 'Basic Facial Cleansing',
    category: 'Facial Cleansing',
    image: LIMPIEZA_FACIAL_BASICS_IMAGE,
    duration: '45 minutes',
    ...askForPrice,
    benefits: ['Surface cleansing', 'Fresh, balanced skin', 'Impurity removal', 'Daily skin preparation'],
    description: 'Essential facial cleansing to keep skin clean, fresh, and balanced. Ideal for regular maintenance.',
  },
  {
    id: '10',
    name: 'Deep Facial Cleansing',
    category: 'Facial Cleansing',
    image: LIMPIEZA_FACIAL_PROFUNDA_IMAGE,
    duration: '75 minutes',
    ...askForPrice,
    benefits: ['Impurity extraction', 'Purified pores', 'Cellular renewal', 'Smoother, more even skin'],
    description: 'Complete facial hygiene protocol with exfoliation, steam, and extraction to deeply renew the skin.',
  },
  {
    id: '11',
    name: 'Hydrating Facial Cleansing',
    category: 'Facial Cleansing',
    image: LIMPIEZA_FACIAL_HIDRATANTE_IMAGE,
    duration: '60 minutes',
    ...askForPrice,
    benefits: ['Intense hydration', 'Skin barrier restoration', 'Immediate softness', 'Comfortable, luminous skin'],
    description: 'Facial treatment focused on restoring hydration levels with nourishing actives and restorative masks.',
  },
  {
    id: '12',
    name: 'Acne-Prone Skin Facial Cleansing',
    category: 'Facial Cleansing',
    image: LIMPIEZA_FACIAL_ACNEICA_IMAGE,
    duration: '75 minutes',
    ...askForPrice,
    benefits: ['Sebum control', 'Antibacterial action', 'Unclogged pores', 'Improvement of active breakouts'],
    description: 'Facial cleansing designed for acne-prone skin, focused on purification, balance, and calming the skin.',
  },
  {
    id: '13',
    name: 'Hyperpigmentation Facial Cleansing',
    category: 'Facial Cleansing',
    image: LIMPIEZA_FACIAL_DESPIGMENTACION_IMAGE,
    duration: '75 minutes',
    ...askForPrice,
    benefits: ['Even skin tone', 'Reduced dark spots', 'More uniform complexion', 'Renewed radiance'],
    description: 'Facial treatment aimed at fading dark spots and evening skin tone with professional depigmenting actives.',
  },
  {
    id: '14',
    name: 'Anti-Aging Facial Cleansing',
    category: 'Facial Cleansing',
    image: LIMPIEZA_FACIAL_ANTIEDAD_IMAGE,
    duration: '75 minutes',
    ...askForPrice,
    benefits: ['Collagen stimulation', 'Improved firmness', 'Softened fine lines', 'More youthful appearance'],
    description: 'Anti-aging protocol combining cleansing, regenerating actives, and manual techniques to revitalize and firm the skin.',
  },
  {
    id: '15',
    name: 'Hydrafacial',
    category: 'Facial Cleansing',
    image: HIDRAFACIAL_IMAGE,
    duration: '60 minutes',
    ...askForPrice,
    benefits: ['Technology-powered cleansing', 'Deep hydration', 'Instant glow', 'No downtime'],
    description: 'Facial treatment with hydrodermabrasion technology that cleanses, exfoliates, extracts, and hydrates in a single session.',
  },
  {
    id: '16',
    name: 'Oxygenating Facial Cleansing',
    category: 'Facial Cleansing',
    image: LIMPIEZA_FACIAL_OXIGENANTE_IMAGE,
    duration: '60 minutes',
    ...askForPrice,
    benefits: ['Cellular oxygenation', 'Revitalized skin', 'Rested appearance', 'Enhanced skin vitality'],
    description: 'Facial that delivers oxygen and nutrients to the skin to restore energy, freshness, and a healthier appearance.',
  },
  {
    id: '17',
    name: 'Premium Facial Cleansing',
    category: 'Facial Cleansing',
    image: LIMPIEZA_FACIAL_PREMIUM_IMAGE,
    duration: '90 minutes',
    ...askForPrice,
    benefits: ['Luxury experience', 'Personalized protocol', 'Visible results', 'Maximum comfort and care'],
    description: 'The studio\'s most complete facial experience: deep cleansing, premium actives, and a personalized ritual for outstanding results.',
  },
  {
    id: '18',
    name: 'Platelet-Rich Plasma',
    category: 'Advanced Treatments',
    image: PLASMA_RPP_IMAGE,
    duration: '60 minutes',
    ...askForPrice,
    benefits: ['Tissue regeneration', 'Collagen stimulation', 'Improved skin texture', 'Natural rejuvenation'],
    description: 'Advanced PRP treatment that uses growth factors from your own blood to stimulate skin regeneration and quality.',
  },
  {
    id: '19',
    name: 'Salmon PDRN',
    category: 'Advanced Treatments',
    image: PDRN_SALMON_IMAGE,
    duration: '60 minutes',
    ...askForPrice,
    benefits: ['Cellular repair', 'Deep hydration', 'Improved elasticity', 'More resilient skin'],
    description: 'Bio-stimulator with salmon polynucleotides that supports cellular repair, hydration, and skin regeneration.',
  },
  {
    id: '20',
    name: 'Exosomes',
    category: 'Advanced Treatments',
    image: EXOSOMAS_IMAGE,
    duration: '60 minutes',
    ...askForPrice,
    benefits: ['Advanced regeneration', 'Cellular communication', 'Next-generation anti-aging', 'Renewed, luminous skin'],
    description: 'Cutting-edge exosome treatment that enhances skin regeneration, improves skin quality, and delivers a rejuvenating effect.',
  },
  {
    id: '21',
    name: 'Wax Hair Removal',
    category: 'Waxing',
    image: DEPILACION_CERA_IMAGE,
    duration: '45 minutes',
    ...askForPrice,
    benefits: ['Smooth, hair-free skin', 'Long-lasting results', 'Hygienic, precise application', 'Ideal for face and body'],
    description: 'Professional warm wax hair removal using high-quality wax for effective results, leaving skin smooth, cared for, and flawlessly finished.',
  },
  {
    id: '22',
    name: 'Eyebrow Waxing',
    category: 'Brows & Face',
    image: DEPILACION_CEJAS_IMAGE,
    duration: '30 minutes',
    ...askForPrice,
    benefits: ['Defined, symmetrical brows', 'Precise hair removal', 'Clean, natural finish', 'More harmonious gaze'],
    description: 'Professional eyebrow waxing or tweezing tailored to your face shape for a clean, symmetrical, and natural brow profile.',
  },
  {
    id: '23',
    name: 'Brow Lamination',
    category: 'Brows & Face',
    image: LAMINADO_CEJAS_IMAGE,
    duration: '45 minutes',
    ...askForPrice,
    benefits: ['Visually fuller brows', 'Groomed, styled effect', 'Enhanced definition', 'Long-lasting results'],
    description: 'Brow lamination treatment that smooths, sets, and directs brow hairs for a fuller, structured, polished look that lasts for weeks.',
  },
  {
    id: '24',
    name: 'LED Light Facial Treatment',
    category: 'Advanced Treatments',
    image: TRATAMIENTO_FACIAL_LUZ_LED_IMAGE,
    duration: '45 minutes',
    ...askForPrice,
    benefits: ['Cellular stimulation', 'Enhanced radiance', 'Anti-inflammatory action', 'More even, healthier skin'],
    description: 'Facial treatment with LED phototherapy using specific light wavelengths to stimulate the skin, reduce inflammation, and support cutaneous regeneration.',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'What types of massages does YolyStudio offer?',
    answer: 'We offer relaxing massage, deep tissue massage, relaxation massage, body contouring massage, lymphatic drainage, facial yoga massage, post-operative lymphatic drainage, and wood therapy, always tailored to your needs.',
  },
  {
    question: 'What facial cleansing treatments are available?',
    answer: 'We offer basic, deep, hydrating, acne-prone skin, hyperpigmentation, anti-aging, and premium facial cleansing, as well as Hydrafacial.',
  },
  {
    question: 'What advanced treatments do you perform?',
    answer: 'We apply premium protocols such as Platelet-Rich Plasma (PRP), Salmon PDRN, and Exosomes for skin regeneration and rejuvenation.',
  },
  {
    question: 'What care should I take before and after a facial treatment?',
    answer: 'Before your appointment, avoid prolonged direct sun exposure and do not use acids or abrasive at-home peels. After treatment, apply SPF 50+ sunscreen, keep your skin hydrated, and avoid heavy makeup for the first 24 hours.',
  },
  {
    question: 'Do you offer waxing and brow services?',
    answer: 'Yes. We provide wax hair removal, eyebrow waxing, and brow lamination using professional techniques tailored to each face.',
  },
  {
    question: 'How does the booking and cancellation process work?',
    answer: 'You can pre-book your appointment online by selecting the service, date, and time. Yoly will confirm your appointment personally by phone or WhatsApp. If you need to reschedule or cancel, please notify us at least 24 hours in advance.',
  },
];
