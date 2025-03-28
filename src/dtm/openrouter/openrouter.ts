import { BotStateStandAlone } from '@builderbot/bot/dist/types';
import OpenAI from 'openai';


const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',  
  apiKey: process.env.OPENROUTER_API_KEY,  
//   defaultHeaders: {
//     'HTTP-Referer': process.env.SITE_URL,  // Opcional, URL del sitio
//     'X-Title': process.env.SITE_NAME,  // Opcional, Título del sitio
//   },
});

// Función toAsk para enviar mensajes y recibir respuestas
export const toAsk = async (assistantId: string, message: string, state: BotStateStandAlone): Promise<string> => {
  try {
    const completion = await openai.chat.completions.create({
    //   model: 'openai/gpt-4o:free',
      model: 'deepseek/deepseek-r1:free',  
      messages: [
        { role: 'user', content: message },  
      ],
    });

    // console.log(completion)
    const generatedResponse = completion.choices[0].message.content;
    // const generatedResponse = "DEV";


    await state.update({ lastAssistantResponse: generatedResponse });

    return generatedResponse;  
  } catch (error) {
    console.error('Error al contactar OpenRouter:', error);
    return 'Saludos, estamos tomando un café, le atenderemos de inmediato';  
  }
};
