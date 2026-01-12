
'use server';

import OpenAI from 'openai';

// Initialize the DeepSeek client, which is compatible with the OpenAI SDK
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});

/**
 * Calls the DeepSeek API to generate content based on a prompt.
 * @param prompt The prompt to send to the AI model.
 * @returns A promise that resolves to the string content of the AI's response.
 */
const callDeepSeek = async (prompt: string): Promise<string> => {
    console.log('Attempting to call DeepSeek...');
    const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: 'user', content: prompt }],
    });
    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error('DeepSeek returned an empty response.');
    }
    console.log('DeepSeek call successful.');
    return content;
};

/**
 * The primary function for generating AI content, now exclusively using DeepSeek.
 * @param prompt The prompt to send to the AI model.
 * @returns A promise that resolves to the string content of the AI's response.
 */
export async function callGenerativeAI(prompt: string): Promise<string> {
  // If the DeepSeek API key is not set, throw an error.
  if (!process.env.DEEPSEEK_API_KEY) {
      console.error('DeepSeek API key not set.');
      throw new Error('AI service is not configured. Missing API key.');
  }

  try {
    const result = await callDeepSeek(prompt);
    return result;
  } catch (error: any) {
    console.error(`DeepSeek API call failed. Reason:`, error.message);
    // Re-throw the error to be handled by the calling function's try/catch block.
    throw new Error(`AI generation failed. Last error: ${error?.message || 'Unknown error'}`);
  }
}
