# WhatsApp AI Assistant Bot with REST API (BuilderBot.app)

<p align="center">
  <img src="https://builderbot.vercel.app/assets/thumbnail-vector.png" height="80">
</p>

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/6VbbLI?referralCode=jyd_0y)

This project creates a WhatsApp bot that integrates with an AI assistant using BuilderBot technology. It allows for automated conversations and intelligent responses powered by OpenAI's assistant API. **Now includes a REST API for sending WhatsApp messages programmatically.**

## Features

- Automated conversation flows for WhatsApp
- Integration with OpenAI's assistant API
- **NEW: REST API for sending WhatsApp messages**
- **NEW: JWT Authentication for API security**
- **NEW: Support for media files (images, videos, documents)**
- Agnostic to WhatsApp provider
- Automated responses to frequently asked questions
- Real-time message receiving and responding
- Interaction tracking with customers
- Expandable functionality through triggers

## API Features

- **POST /send-message**: Send text and media messages to WhatsApp
- **GET /health**: Health check endpoint
- **GET /status**: Check WhatsApp connection status
- JWT authentication for secure access
- File upload support (up to 10MB)
- Comprehensive validation and error handling

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Set up your environment variables in a `.env` file:
   ```
   PORT=3008
   ASSISTANT_ID=your_openai_assistant_id
   JWT_SECRET=your-secret-key
   ```
4. Run the development server:
   ```
   pnpm run dev
   ```

### Using Docker (Recommended)

This project includes a Dockerfile for easy deployment and consistent environments. To use Docker:

1. Build the Docker image:
   ```
   docker build -t whatsapp-ai-assistant .
   ```
2. Run the container:
   ```
   docker run -p 3008:3008 --env-file .env whatsapp-ai-assistant
   ```

This method ensures that the application runs in a consistent environment across different systems.

## API Usage

### Quick Start

1. **Generate a JWT token:**
   ```javascript
   const jwt = require('jsonwebtoken');
   const token = jwt.sign({ userId: 'user123' }, 'your-secret-key');
   ```

2. **Send a message:**
   ```bash
   curl -X POST http://localhost:3008/send-message \
     -H "Authorization: Bearer your-jwt-token" \
     -F "message=Hello from API" \
     -F "receiver=1234567890@s.whatsapp.net" \
     -F "token=your-jwt-token"
   ```

3. **Send message with image:**
   ```bash
   curl -X POST http://localhost:3008/send-message \
     -H "Authorization: Bearer your-jwt-token" \
     -F "message=Check this image" \
     -F "receiver=1234567890@s.whatsapp.net" \
     -F "token=your-jwt-token" \
     -F "media=@/path/to/image.jpg"
   ```

### JavaScript Example

```javascript
const axios = require('axios');
const FormData = require('form-data');

async function sendWhatsAppMessage() {
  const formData = new FormData();
  formData.append('message', 'Hello from Node.js!');
  formData.append('receiver', '1234567890@s.whatsapp.net');
  formData.append('token', 'your-jwt-token');

  try {
    const response = await axios.post('http://localhost:3008/send-message', formData, {
      headers: {
        'Authorization': 'Bearer your-jwt-token',
        ...formData.getHeaders()
      }
    });
    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
```

## Usage

The bot is configured in the `src/app.ts` file. It uses the BuilderBot library to create flows and handle messages. The main welcome flow integrates with the OpenAI assistant to generate responses.

The API is configured in `src/api.ts` and provides REST endpoints for sending WhatsApp messages programmatically.

## Documentation

- **API Documentation**: See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference
- **BuilderBot Documentation**: For more detailed information on how to use and extend this bot, please refer to the [BuilderBot documentation](https://builderbot.vercel.app/).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Contact

For questions and support, join our [Discord community](https://link.codigoencasa.com/DISCORD) or follow us on [Twitter](https://twitter.com/leifermendez).

---

Built with [BuilderBot](https://www.builderbot.app/en) - Empowering conversational AI for WhatsApp
