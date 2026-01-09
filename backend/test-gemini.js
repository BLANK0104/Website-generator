const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyACj5Rpl5jZc61vJHSFd62qGkJP0BCCSg4');

async function listModels() {
  try {
    console.log('🔍 Fetching available Gemini models...\n');
    
    // Try different models to see which ones work
    const modelsToTest = [
      'gemini-1.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash-8b',
      'gemini-1.5-flash-8b-latest',
      'gemini-1.5-pro',
      'gemini-1.5-pro-latest',
      'gemini-1.5-pro-002',
      'gemini-pro',
      'gemini-2.0-flash',
      'gemini-2.0-flash-exp',
      'gemini-2.0-flash-thinking-exp',
      'gemini-2.0-flash-thinking-exp-1219',
      'gemini-2.5-flash',
      'gemini-2.5-flash-latest',
      'gemini-exp-1206',
      'gemini-exp-1121',
      'learnlm-1.5-pro-experimental'
    ];
    
    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Say "OK"');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ ${modelName}: WORKING - Response: ${text.substring(0, 50)}`);
      } catch (error) {
        console.log(`❌ ${modelName}: FAILED - ${error.message.substring(0, 100)}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
