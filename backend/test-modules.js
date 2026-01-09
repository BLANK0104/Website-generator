// Test script to verify all modules load correctly
require('dotenv').config();
console.log('Testing module loading...\n');

try {
  console.log('1. Loading componentLibrary...');
  const componentLibrary = require('./services/componentLibrary');
  console.log('✓ componentLibrary loaded');
  console.log('   Components:', Object.keys(componentLibrary).join(', '));
  
  console.log('\n2. Loading codeGenerator...');
  const codeGenerator = require('./services/codeGenerator');
  console.log('✓ codeGenerator loaded');
  console.log('   Type:', typeof codeGenerator);
  
  console.log('\n3. Loading aiService...');
  const aiService = require('./services/aiService');
  console.log('✓ aiService loaded');
  console.log('   Methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(aiService)).filter(m => m !== 'constructor').join(', '));
  
  console.log('\n4. Loading GeneratedWebsite model...');
  const GeneratedWebsite = require('./models/GeneratedWebsite');
  console.log('✓ GeneratedWebsite model loaded');
  
  console.log('\n5. Loading generateWebsite routes...');
  const generateWebsiteRoutes = require('./routes/generateWebsite');
  console.log('✓ generateWebsite routes loaded');
  
  console.log('\n✅ All modules loaded successfully!');
  console.log('\nYou can now start the server with: npm start');
  
} catch (error) {
  console.error('\n❌ Error loading modules:');
  console.error(error.message);
  console.error('\nStack trace:');
  console.error(error.stack);
  process.exit(1);
}
