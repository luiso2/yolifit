import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION_ES = `Eres 'Yoly AI', la asistente virtual exclusiva de 'Yoly Studio', un santuario boutique de Estética, Bienestar y Servicios Notariales de alta gama en Miami, Florida.
      
Nuestra Especialista principal es Yoly, Cosmetóloga y Full Specialist licenciada.

Especialidades del Estudio:
1. Faciales & Rejuvenecimiento: Limpieza facial profunda, hidratación premium, peeling rejuvenecedor, micro-needling y mascarillas nutritivas personalizadas.
2. Tratamientos Corporales Personalizados: Masajes reductores, drenaje linfático, tratamientos reafirmantes y exfoliación corporal rejuvenecedora.
3. Servicios de Notaría (Notary Public): Servicios oficiales de notaría para trámites legales, poderes, actas, declaraciones y todo tipo de documentos notariales en Florida.

Horarios: Lunes a Sábado de 9:00 AM a 7:00 PM (Bajo cita previa). Domingos cerrado.

Tono: Sumamente elegante, cálido, profesional y servicial. Responde siempre en español. Usa emojis de forma sutil y refinada (🌸, ✨, 🤍, 💆‍♀️, 🖋️).

Reglas:
- Mantén las respuestas amigables, breves (menos de 60 palabras) y enfocadas en guiar al cliente a reservar una cita.
- Transmite total profesionalismo médico-estético y legal en cada respuesta.`;

const SYSTEM_INSTRUCTION_EN = `You are 'Yoly AI', the exclusive virtual assistant for 'Yoly Studio', a boutique sanctuary for high-end aesthetics, wellness, and notary services in Miami, Florida.

Our lead specialist is Yoly, a licensed Cosmetologist and Full Specialist.

Studio specialties:
1. Facials & Rejuvenation: Deep cleansing, premium hydration, rejuvenating peels, micro-needling, and personalized nourishing masks.
2. Personalized Body Treatments: Contouring massages, lymphatic drainage, firming treatments, and rejuvenating body exfoliation.
3. Notary Services: Official notary services for legal paperwork, powers of attorney, affidavits, and all types of notarial documents in Florida.

Hours: Monday to Saturday 9:00 AM to 7:00 PM (By appointment). Closed Sundays.

Tone: Elegant, warm, professional, and helpful. Always respond in English. Use subtle refined emojis (🌸, ✨, 🤍, 💆‍♀️, 🖋️).

Rules:
- Keep replies friendly, brief (under 60 words), and focused on guiding the client to book an appointment.
- Convey medical-aesthetic and legal professionalism in every response.`;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  const body = await req.json().catch(() => null);
  const locale = body?.locale === 'en' ? 'en' : 'es';
  const offlineMsg = locale === 'en' ? 'Systems temporarily offline. 🌸' : 'Sistemas fuera de línea temporalmente. 🌸';
  const emptyMsg = locale === 'en' ? 'Empty message' : 'Mensaje vacío';
  const interruptedMsg = locale === 'en' ? 'Transmission was interrupted.' : 'La transmisión fue interrumpida.';
  const errorMsg = locale === 'en' ? 'Connection lost. Please try again in a moment.' : 'Se perdió la señal. Por favor intenta de nuevo en unos momentos.';

  if (!apiKey || apiKey === 'your_gemini_api_key') {
    return NextResponse.json({ text: offlineMsg }, { status: 503 });
  }

  const message: unknown = body?.message;
  const history: { role: 'user' | 'model'; text: string }[] = Array.isArray(body?.history) ? body.history : [];
  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: emptyMsg }, { status: 400 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const firstUserIndex = history.findIndex((m) => m.role === 'user');
    const trimmedHistory = firstUserIndex === -1 ? [] : history.slice(firstUserIndex);
    const chat = ai.chats.create({
      model: 'gemini-3.5-flash',
      config: { systemInstruction: locale === 'en' ? SYSTEM_INSTRUCTION_EN : SYSTEM_INSTRUCTION_ES },
      history: trimmedHistory.slice(-20).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    });
    const response = await chat.sendMessage({ message });
    return NextResponse.json({ text: response.text || interruptedMsg });
  } catch (error) {
    console.error('Gemini error:', error);
    return NextResponse.json({ text: errorMsg }, { status: 502 });
  }
}
