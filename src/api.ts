import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import multer from 'multer';
import { BaileysProvider } from '@builderbot/provider-baileys';
import { createProvider } from '@builderbot/bot';

const app = express();
const API_PORT = process.env.API_PORT ?? process.env.PORT ?? 3008;
const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Multer config for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// JWT Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Global provider instance
let provider: BaileysProvider | null = null;

// Initialize WhatsApp provider
const initializeProvider = async () => {
  if (!provider) {
    provider = createProvider(BaileysProvider, {
      groupsIgnore: true,
      readStatus: false,
    });
  }
  return provider;
};

// Validation function
const validateMessageRequest = (body: any) => {
  const errors: string[] = [];

  if (!body.message || typeof body.message !== 'string') {
    errors.push('message is required and must be a string');
  }

  if (!body.receiver || typeof body.receiver !== 'string') {
    errors.push('receiver is required and must be a string');
  }

  // Validate phone number format (basic validation)
  const phoneRegex = /^[0-9]+@[a-z]+\.[a-z]+$/;
  if (!phoneRegex.test(body.receiver)) {
    errors.push('receiver must be in format: number@s.whatsapp.net');
  }

  return errors;
};

// Send message function using Baileys
const sendWhatsAppMessage = async (receiver: string, message: string, media?: Buffer, mediaType?: string) => {
  const provider = await initializeProvider();
  
  if (!provider.vendor) {
    throw new Error('WhatsApp provider not initialized');
  }

  const messageOptions: any = {
    text: message,
  };

  // Add media if provided
  if (media && mediaType) {
    messageOptions[mediaType] = media;
  }

  try {
    const result = await provider.vendor.sendMessage(receiver, messageOptions);
    return result;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw new Error(`Failed to send message: ${error}`);
  }
};

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Send message endpoint
app.post('/send-message', authenticateToken, upload.single('media'), async (req, res): Promise<void> => {
  try {
    const { message, receiver, token } = req.body;
    const media = req.file?.buffer;
    const mediaType = req.file?.mimetype;

    // Validate request body
    const validationErrors = validateMessageRequest(req.body);
    if (validationErrors.length > 0) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors 
      });
      return;
    }

    // Send message
    const result = await sendWhatsAppMessage(receiver, message, media, mediaType);

    res.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        receiver,
        message,
        timestamp: new Date().toISOString(),
        result
      }
    });

  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get provider status
app.get('/status', authenticateToken, async (req, res) => {
  try {
    const provider = await initializeProvider();
    // Check if provider is connected by checking if vendor exists
    const isConnected = !!provider.vendor;
    
    res.json({
      success: true,
      status: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get status',
      message: error.message
    });
  }
});

// Start server
const startServer = () => {
  app.listen(API_PORT, () => {
    console.log(`WhatsApp API server running on port ${API_PORT}`);
  });
};

export { startServer, app }; 