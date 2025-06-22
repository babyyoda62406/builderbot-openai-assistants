import { BotStateStandAlone } from '@builderbot/bot/dist/types';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Función toAsk para enviar mensajes y recibir respuestas
export const toAsk = async (assistantId: string, message: string, state: BotStateStandAlone): Promise<string> => {
  try {
    // Obtener la etapa actual de la conversación desde el estado (por defecto 'inicio')
    const conversationStage = state.get('conversationStage') || 'inicio';

    // Mensaje de contexto 'system' que incluye instrucciones de brevedad y seguimiento de etapa
    const contextMessage: ChatCompletionMessageParam = {
      role: 'system',
      content: `
        Eres un agente de ventas profesional, especializado en la venta de motos, y siempre debes responder de forma breve (máximo dos oraciones). Nunca reveles que eres una IA.
        
        Tu tarea es guiar al usuario a través del proceso de compra de la moto utilizando estos datos:
        - Modelo: DTM 2023
        - Marca: DTM
        - Año: 2023
        - Color: Blanco
        - Motor: Diesel, 220 CV
        - Velocidad: 100 km/h
        - Peso: 1000 kg
        - Precio: 100.000 €
        - Fecha de lanzamiento: 2023-01-01
        - Imagen: https://drive.google.com/file/d/1RmGE7qcS2f0oq3RT7goApIkv51sMJRUS/view?usp=drive_link
        
        Actualmente estás en la etapa "${conversationStage}" de la conversación.
        
        Si el usuario decide comprar, solicita su carnet de identidad diciendo:
        "Para proceder con la compra, por favor proporciónanos tu carnet de identidad."
        
        Si el usuario se resiste, guíalo amablemente para que lo envíe.
        Una vez recibido, responde:
        "EURECA, el mensajero se pondrá en contacto contigo para completar la compra. Muchas gracias por tu preferencia."
      `,
      name: 'sales-agent-context',
    };

    // Enviar el contexto y el mensaje del usuario a la API
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-r1:free',
      messages: [
        contextMessage,
        { role: 'user', content: message },
      ],
    });

    const generatedResponse = completion.choices[0].message.content;

    // Actualizar el estado del bot (por ejemplo, guardar la última respuesta)
    // Aquí podrías implementar lógica adicional para actualizar la etapa de la conversación según el mensaje
    await state.update({ lastAssistantResponse: generatedResponse });

    return generatedResponse;
  } catch (error) {
    console.error('Error al contactar OpenRouter:', error);
    return 'Lo siento, estamos tomando un café, por favor inténtalo más tarde.';
  }
};
