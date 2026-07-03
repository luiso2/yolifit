/**
 * Google Business Profile for Clinic YolyStudio.
 * When you have the Place ID, set GOOGLE_PLACE_ID to enable the direct write-review URL.
 */
export const GOOGLE_PLACE_ID = '';

const ADDRESS = '2500 NW 79 Ave Unit 297, Doral, FL 33122';
const MAPS_QUERY = encodeURIComponent(`Clinic YolyStudio, ${ADDRESS}`);

export const GOOGLE_BUSINESS = {
  name: 'Clinic YolyStudio',
  address: ADDRESS,
  locationLabel: ADDRESS,
  rating: 5,
  mapsQuery: `Clinic YolyStudio, ${ADDRESS}`,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`,
  mapsEmbedUrl: `https://maps.google.com/maps?q=${MAPS_QUERY}&hl=es&z=16&output=embed`,
  writeReviewUrl: GOOGLE_PLACE_ID
    ? `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`
    : `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`,
} as const;

export type ReviewTestimonial = {
  id: string;
  author: string;
  rating: number;
  textEs: string;
  textEn: string;
};

/** Client testimonials featured from Google reviews */
export const GOOGLE_REVIEWS: ReviewTestimonial[] = [
  {
    id: '1',
    author: 'María G.',
    rating: 5,
    textEs:
      'Excelente atención y resultados increíbles. El drenaje linfático detox me dejó una sensación de ligereza desde la primera sesión. Yoly es muy profesional y el ambiente es impecable.',
    textEn:
      'Outstanding care and incredible results. The lymphatic detox drainage left me feeling lighter from the first session. Yoly is very professional and the space is impeccable.',
  },
  {
    id: '2',
    author: 'Andrea R.',
    rating: 5,
    textEs:
      'Me hice una limpieza facial profunda y salí con la piel luminosa y renovada. Se nota la experiencia clínica y el cuidado en cada detalle. 100% recomendada.',
    textEn:
      'I had a deep facial cleansing and left with glowing, renewed skin. You can feel the clinical experience and care in every detail. 100% recommended.',
  },
  {
    id: '3',
    author: 'Carolina M.',
    rating: 5,
    textEs:
      'La maderoterapia y el masaje reductivo superaron mis expectativas. Trato cálido, puntualidad y resultados visibles. Clinic YolyStudio es mi lugar de confianza en Miami.',
    textEn:
      'Wood therapy and body contouring massage exceeded my expectations. Warm care, punctuality, and visible results. Clinic YolyStudio is my trusted place in Miami.',
  },
  {
    id: '4',
    author: 'Valentina S.',
    rating: 5,
    textEs:
      'Después de mi cirugía, el drenaje post operatorio con Yoly fue clave en mi recuperación. Técnica segura, manos expertas y mucha empatía. Gracias por tanto cuidado.',
    textEn:
      'After my surgery, post-operative drainage with Yoly was key to my recovery. Safe technique, expert hands, and so much empathy. Thank you for such care.',
  },
];
