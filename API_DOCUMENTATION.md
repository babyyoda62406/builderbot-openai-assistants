# WhatsApp API Documentation

## Overview

Esta API REST permite enviar mensajes a WhatsApp usando la librería Baileys y BuilderBot. Incluye autenticación JWT y soporte para mensajes con archivos multimedia.

## Base URL

```
http://localhost:3008
```

## Autenticación

La API usa autenticación JWT. Incluye el token en el header `Authorization`:

```
Authorization: Bearer <your-jwt-token>
```

### Generar Token JWT

```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: 'user123' }, 'your-secret-key');
```

## Endpoints

### 1. Health Check

**GET** `/health`

Verifica el estado del servidor.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Send Message

**POST** `/send-message`

Envía un mensaje a WhatsApp.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Body (multipart/form-data):**
- `message` (string, required): Texto del mensaje
- `receiver` (string, required): Número de teléfono en formato `1234567890@s.whatsapp.net`
- `token` (string, required): Token adicional (puede ser el mismo JWT)
- `media` (file, optional): Archivo multimedia (máximo 10MB)

**Ejemplo con cURL:**
```bash
curl -X POST http://localhost:3008/send-message \
  -H "Authorization: Bearer your-jwt-token" \
  -F "message=Hola desde la API" \
  -F "receiver=1234567890@s.whatsapp.net" \
  -F "token=your-jwt-token"
```

**Ejemplo con imagen:**
```bash
curl -X POST http://localhost:3008/send-message \
  -H "Authorization: Bearer your-jwt-token" \
  -F "message=Mira esta imagen" \
  -F "receiver=1234567890@s.whatsapp.net" \
  -F "token=your-jwt-token" \
  -F "media=@/path/to/image.jpg"
```

**Response Success:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "receiver": "1234567890@s.whatsapp.net",
    "message": "Hola desde la API",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "result": {
      "key": {
        "remoteJid": "1234567890@s.whatsapp.net",
        "fromMe": true,
        "id": "message-id"
      }
    }
  }
}
```

**Response Error:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "receiver must be in format: number@s.whatsapp.net"
  ]
}
```

### 3. Get Status

**GET** `/status`

Obtiene el estado de conexión del proveedor de WhatsApp.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "status": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Validación fallida |
| 401 | Unauthorized - Token no proporcionado |
| 403 | Forbidden - Token inválido |
| 500 | Internal Server Error - Error del servidor |

## Validaciones

### Formato de Número de Teléfono
- Debe seguir el formato: `1234567890@s.whatsapp.net`
- Solo números en la parte del número
- Sufijo `@s.whatsapp.net` obligatorio

### Límites de Archivos
- Tamaño máximo: 10MB
- Formatos soportados: Imágenes, videos, documentos, audio

## Variables de Entorno

```env
PORT=3008
JWT_SECRET=your-secret-key
ASSISTANT_ID=your-openai-assistant-id
```

## Ejemplos de Uso

### JavaScript/Node.js

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

// Enviar mensaje de texto
async function sendTextMessage() {
  const formData = new FormData();
  formData.append('message', 'Hola desde Node.js');
  formData.append('receiver', '1234567890@s.whatsapp.net');
  formData.append('token', 'your-jwt-token');

  try {
    const response = await axios.post('http://localhost:3008/send-message', formData, {
      headers: {
        'Authorization': 'Bearer your-jwt-token',
        ...formData.getHeaders()
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
}

// Enviar mensaje con imagen
async function sendImageMessage() {
  const formData = new FormData();
  formData.append('message', 'Mira esta imagen');
  formData.append('receiver', '1234567890@s.whatsapp.net');
  formData.append('token', 'your-jwt-token');
  formData.append('media', fs.createReadStream('./image.jpg'));

  try {
    const response = await axios.post('http://localhost:3008/send-message', formData, {
      headers: {
        'Authorization': 'Bearer your-jwt-token',
        ...formData.getHeaders()
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
}
```

### Python

```python
import requests

def send_message():
    url = "http://localhost:3008/send-message"
    headers = {
        "Authorization": "Bearer your-jwt-token"
    }
    data = {
        "message": "Hola desde Python",
        "receiver": "1234567890@s.whatsapp.net",
        "token": "your-jwt-token"
    }
    
    response = requests.post(url, headers=headers, data=data)
    print(response.json())

def send_message_with_image():
    url = "http://localhost:3008/send-message"
    headers = {
        "Authorization": "Bearer your-jwt-token"
    }
    files = {
        "media": open("image.jpg", "rb")
    }
    data = {
        "message": "Mira esta imagen",
        "receiver": "1234567890@s.whatsapp.net",
        "token": "your-jwt-token"
    }
    
    response = requests.post(url, headers=headers, data=data, files=files)
    print(response.json())
```

## Notas Importantes

1. **Primera Conexión**: La primera vez que uses la API, necesitarás escanear un código QR para conectar WhatsApp Web.

2. **Sesiones**: Las sesiones se guardan automáticamente para reconexiones futuras.

3. **Rate Limiting**: Respeta los límites de WhatsApp para evitar bloqueos.

4. **Números de Teléfono**: Asegúrate de que los números estén en el formato correcto.

5. **Archivos**: Los archivos se procesan en memoria, evita archivos muy grandes.

## Troubleshooting

### Error: "WhatsApp provider not initialized"
- Verifica que el bot esté ejecutándose correctamente
- Revisa los logs del servidor

### Error: "Invalid token"
- Verifica que el JWT_SECRET esté configurado correctamente
- Asegúrate de incluir "Bearer " antes del token

### Error: "Validation failed"
- Verifica el formato del número de teléfono
- Asegúrate de que todos los campos requeridos estén presentes 