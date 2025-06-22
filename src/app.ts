import "dotenv/config"
import { createBot, createProvider, createFlow, addKeyword, EVENTS } from '@builderbot/bot'
import { MemoryDB } from '@builderbot/bot'
import { BaileysProvider } from '@builderbot/provider-baileys'
import { startServer } from "./api"

/** Puerto en el que se ejecutará el servidor */
const PORT = process.env.PORT ?? 3008

/**
 * Función principal que configura y inicia el bot
 * @async
 * @returns {Promise<void>}
 */
const main = async () => {
    /**
     * Flujo del bot - Solo para mantener la conexión WhatsApp
     * @type {import('@builderbot/bot').Flow<BaileysProvider, MemoryDB>}
     */
    const adapterFlow = createFlow([]);

    /**
     * Proveedor de servicios de mensajería
     * @type {BaileysProvider}
     */
    const adapterProvider = createProvider(BaileysProvider, {
        groupsIgnore: true,
        readStatus: false,
    });

    /**
     * Base de datos en memoria para el bot
     * @type {MemoryDB}
     */
    const adapterDB = new MemoryDB();

    /**
     * Configuración y creación del bot
     * @type {import('@builderbot/bot').Bot<BaileysProvider, MemoryDB>}
     */
    const { httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    });

    // Start the WhatsApp API server
    startServer();
    
    console.log(`WhatsApp API server running on port ${PORT}`);
    console.log('Scan the QR code to connect WhatsApp');
};

main();
