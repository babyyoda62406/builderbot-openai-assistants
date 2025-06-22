import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot'
import { JsonFileDB as Database } from '@builderbot/database-json'
import dotenv from 'dotenv'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

dotenv.config()
const PORT = process.env.PORT ?? 3008


const main = async () => {
    const adapterFlow = createFlow([])
    
    const adapterProvider = createProvider(Provider)
    
    const adapterDB = new Database({ filename: 'db.json' })

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
        const { number, message, urlMedia } = req.body
        await bot.sendMessage(number, message, { media: urlMedia ?? null })
        return res.end('sended')
    }))


    httpServer(+PORT)
}

main()
