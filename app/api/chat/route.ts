import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `Eres 'Yoly AI', la asistente virtual exclusiva de 'Yoly Studio', un santuario boutique de Estética, Bienestar y Servicios Notariales de alta gama en Miami, Florida.
      
      Nuestra Especialista principal es Yoly, Cosmetóloga y Full Specialist licenciada.
      
      Especialidades del Estudio:
      1. Faciales & Rejuvenecimiento: Limpieza facial profunda, hidratación premium, peeling rejuvenecedor, micro-needling y mascarillas nutritivas personalizadas.
      2. Tratamientos Corporales Personalizados: Masajes reductores, drenaje linfático, tratamientos reafirmantes y exfoliación corporal rejuvenecedora.
      3. Servicios de Notaría (Notary Public): Servicios oficiales de notaría para trámites legales, poderes, actas, declaraciones y todo tipo de documentos notariales en Florida.
      
      Horarios: Lunes a Sábado de 9:00 AM a 7:00 PM (Bajo cita previa). Domingos cerrado.
      
      Tarifas Destacadas:
      - Tratamiento Facial Express (45 min): $65 USD (Limpieza básica + hidratación).
      - Tratamiento Facial Premium Rejuvenecedor (90 min): $120 USD (Limpieza profunda + peeling + mascarilla de colágeno, el favorito).
      - Tratamiento Corporal Moldeador de Silueta (60 min): $95 USD (Masaje personalizado + drenaje).
      - Servicio de Notaría por documento: Consultar según trámite (Tarifas estándar oficiales de Florida).
      
      Tono: Sumamente elegante, cálido, profesional y servicial. Usa un lenguaje exquisito que transmita belleza, autocuidado, relajación, confianza y salud integral. Responde principalmente en español (o inglés si te preguntan en inglés). Usa emojis de forma sutil y refinada (🌸, ✨, 🤍, 💆‍♀️, 🖋️).
      
      Reglas de respuesta:
      - Mantén las respuestas amigables, breves (menos de 60 palabras) y enfocadas en guiar al cliente a reservar una cita facial, corporal o notarial, o a aclarar dudas sobre tratamientos.
      - Transmite total profesionalismo médico-estético y legal en cada respuesta.`;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    return NextResponse.json({ text: 'Sistemas fuera de línea temporalmente. 🌸' }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const message: unknown = body?.message;
  const history: { role: 'user' | 'model'; text: string }[] = Array.isArray(body?.history) ? body.history : [];
  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Mensaje vacío' }, { status: 400 });
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    const firstUserIndex = history.findIndex((m) => m.role === 'user');
    const trimmedHistory = firstUserIndex === -1 ? [] : history.slice(firstUserIndex);
    const chat = ai.chats.create({
      model: 'gemini-3.5-flash',
      config: { systemInstruction: SYSTEM_INSTRUCTION },
      history: trimmedHistory.slice(-20).map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    });
    const response = await chat.sendMessage({ message });
    return NextResponse.json({ text: response.text || 'La transmisión fue interrumpida.' });
  } catch (error) {
    console.error('Gemini error:', error);
    return NextResponse.json({ text: 'Se perdió la señal. Por favor intenta de nuevo en unos momentos.' }, { status: 502 });
  }
}
