export interface SpaService {
  id: string;
  name: string;
  category: string;
  image: string;
  video?: string;
  duration: string;
  price: string;
  priceCents: number | null;
  benefits: string[];
  description: string;
}
