export interface SpaService {
  id: string;
  name: string;
  category: string;
  image: string;
  duration: string;
  price: string;
  priceCents: number | null;
  benefits: string[];
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}
