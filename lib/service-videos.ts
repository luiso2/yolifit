/**
 * Video explicativo por servicio (clip real del tratamiento, 15–60 s).
 * Al recibir un .mp4 nuevo: guardarlo en public/media/videos/ y añadir el id aquí.
 */
export const SERVICE_VIDEO_PATHS: Partial<Record<string, string>> = {
  '1': '/media/videos/masaje-relajante.mp4',
  '2': '/media/videos/masaje-descontracturante.mp4',
  '4': '/media/videos/masaje-reductivo.mp4',
  '5': '/media/videos/masaje-drenaje-linfatico.mp4',
  '6': '/media/videos/masaje-yoga-facial.mp4',
  '7': '/media/drenaje-linfatico-post-operatorio.mp4',
  '8': '/media/videos/maderoterapia.mp4',
  '9': '/media/videos/limpieza-facial-basics.mp4',
  '10': '/media/videos/limpieza-facial-profunda.mp4',
  '11': '/media/videos/limpieza-facial-hidratante.mp4',
  '12': '/media/videos/limpieza-facial-acneica.mp4',
  '13': '/media/videos/limpieza-facial-despigmentacion.mp4',
  '14': '/media/videos/limpieza-facial-antiedad.mp4',
  '16': '/media/videos/limpieza-facial-oxigenante.mp4',
  '17': '/media/videos/limpieza-facial-premium.mp4',
  '20': '/media/videos/exosomas.mp4',
  '21': '/media/videos/depilacion-cera.mp4',
  '22': '/media/videos/depilacion-cejas.mp4',
  '24': '/media/videos/tratamiento-facial-luz-led.mp4',
  '25': '/media/videos/lifting-pestanas.mp4',
};

/** Nombre de archivo sugerido al grabar cada sesión (public/media/videos/{slug}.mp4) */
export const SERVICE_VIDEO_SLUGS: Record<string, string> = {
  '1': 'masaje-relajante',
  '2': 'masaje-descontracturante',
  '4': 'masaje-reductivo',
  '5': 'masaje-drenaje-linfatico',
  '6': 'masaje-yoga-facial',
  '7': 'drenaje-linfatico-post-operatorio',
  '8': 'maderoterapia',
  '9': 'limpieza-facial-basics',
  '10': 'limpieza-facial-profunda',
  '11': 'limpieza-facial-hidratante',
  '12': 'limpieza-facial-acneica',
  '13': 'limpieza-facial-despigmentacion',
  '14': 'limpieza-facial-antiedad',
  '15': 'hidrafacial',
  '16': 'limpieza-facial-oxigenante',
  '17': 'limpieza-facial-premium',
  '18': 'plasma-ric-plaquetas',
  '19': 'pdrn-salmon',
  '20': 'exosomas',
  '21': 'depilacion-cera',
  '22': 'depilacion-cejas',
  '23': 'laminado-cejas',
  '24': 'tratamiento-facial-luz-led',
  '25': 'lifting-pestanas',
};

export function resolveServiceVideo(serviceId: string): string | undefined {
  return SERVICE_VIDEO_PATHS[serviceId];
}
