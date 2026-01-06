require('dotenv').config();
const https = require('https');

const API_KEY = process.env.GEMINI_API_KEY;

console.log('🔍 Testing Gemini API Key validity...\n');
console.log(`📝 API Key: ${API_KEY?.substring(0, 20)}...`);

// Test by listing models
const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models?key=${API_KEY}`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`\n📡 Response Status: ${res.statusCode}\n`);
    
    if (res.statusCode === 200) {
      const models = JSON.parse(data);
      console.log('✅ SUCCESS! API Key is valid!\n');
      console.log('📦 Available models:');
      console.log('─'.repeat(50));
      
      if (models.models) {
        models.models.forEach(model => {
          if (model.name && model.supportedGenerationMethods) {
            console.log(`\n✨ ${model.name}`);
            console.log(`   Methods: ${model.supportedGenerationMethods.join(', ')}`);
          }
        });
      }
      console.log('\n' + '─'.repeat(50));
    } else {
      console.log('❌ API Key validation failed!\n');
      console.log('Response:', data);
      
      if (res.statusCode === 400 || res.statusCode === 403) {
        console.log('\n💡 Possible issues:');
        console.log('   - API key is invalid or disabled');
        console.log('   - API key restrictions may be blocking the request');
        console.log('   - Check your API key at: https://makersuite.google.com/app/apikey');
      }
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Network error:', error.message);
});

req.end();
