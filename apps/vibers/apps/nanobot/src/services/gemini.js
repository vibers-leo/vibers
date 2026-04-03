import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

const client = new GoogleGenerativeAI(config.SHARED_API_KEY);

export async function generateImage(apiKey, prompt) {
  try {
    // Use provided API key or fall back to shared key
    const clientWithKey = apiKey && apiKey !== config.SHARED_API_KEY
      ? new GoogleGenerativeAI(apiKey)
      : client;

    const model = clientWithKey.getGenerativeModel({
      model: config.GEMINI_API_MODEL,
    });

    // Create request with image generation
    const result = await model.generateContent({
      contents: [
        {
          parts: [
            {
              text: `다음 프롬프트로 고품질 이미지를 생성해주세요:\n\n${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
    });

    const response = await result.response;
    const text = response.text();

    // Extract image from response if available
    // For Gemini 2.0 Flash with image generation, we'll attempt to parse the response
    logger.info(`[Gemini] Image generation request completed for prompt: ${prompt.substring(0, 50)}...`);

    // Convert text to buffer if it's a data URL or base64
    if (text.includes('data:image')) {
      const base64Data = text.split(',')[1];
      return Buffer.from(base64Data, 'base64');
    }

    // If no image is returned, create a placeholder
    logger.warn('[Gemini] No image data found in response, creating placeholder');
    return Buffer.from('', 'utf-8');

  } catch (error) {
    logger.error('[Gemini] Error:', error);
    throw new Error(`이미지 생성 실패: ${error.message}`);
  }
}

export async function analyzeImage(apiKey, imageBuffer, prompt) {
  try {
    const clientWithKey = apiKey && apiKey !== config.SHARED_API_KEY
      ? new GoogleGenerativeAI(apiKey)
      : client;

    const model = clientWithKey.getGenerativeModel({
      model: config.GEMINI_API_MODEL,
    });

    const base64Image = imageBuffer.toString('base64');

    const result = await model.generateContent({
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    logger.error('[Gemini Vision] Error:', error);
    throw new Error(`이미지 분석 실패: ${error.message}`);
  }
}
