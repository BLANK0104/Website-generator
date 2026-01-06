const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Define JSON schema for website generation
    const schema = {
      type: 'object',
      properties: {
        html: { type: 'string' },
        css: { type: 'string' },
        javascript: { type: 'string' },
        components: { 
          type: 'array',
          items: { type: 'string' }
        },
        description: { type: 'string' }
      },
      required: ['html', 'css', 'javascript', 'components', 'description']
    };
    
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema
      }
    });
  }

  /**
   * Generate website code from a natural language prompt
   * @param {string} prompt - User's description of the website
   * @param {Array} components - Available component templates
   * @returns {Object} Generated HTML, CSS, and JavaScript code
   */
  async generateWebsite(prompt, components = []) {
    try {
      const systemPrompt = `You are an expert web developer and designer. Generate complete, production-ready HTML, CSS, and JavaScript code for websites based on user descriptions.

IMPORTANT RULES:
1. Generate ONLY valid HTML5, CSS3, and vanilla JavaScript
2. Make the design modern, responsive, and visually appealing
3. Use semantic HTML tags
4. Include proper meta tags and responsive viewport settings
5. Use CSS Grid and Flexbox for layouts
6. Add smooth animations and transitions
7. Ensure accessibility (ARIA labels, alt text, proper contrast)
8. Generate complete, self-contained code (no external dependencies except common CDNs for fonts/icons if needed)
9. Include meaningful placeholder content relevant to the website type
10. Add comments to explain complex sections

Available component patterns: ${components.join(', ')}

Format your response as a JSON object with this structure:
{
  "html": "complete HTML code",
  "css": "complete CSS code",
  "javascript": "complete JavaScript code (if needed)",
  "components": ["list of component types used"],
  "description": "brief description of the generated website"
}`;

      const fullPrompt = `${systemPrompt}\n\nUser Request: ${prompt}`;
      
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      let text = response.text();
      
      console.log('📝 Raw Gemini response length:', text.length);
      
      // With responseMimeType set to application/json, Gemini should return clean JSON
      // But we still handle potential edge cases
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```')) {
        const match = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (match) {
          jsonText = match[1].trim();
          console.log('✅ Removed markdown code block wrapper');
        }
      }
      
      console.log('🔍 Attempting to parse JSON...');
      
      let parsed;
      try {
        parsed = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError.message);
        console.error('📄 Problematic area:', jsonText.substring(Math.max(0, parseError.message.match(/\d+/)?.[0] - 100 || 0), Math.min(jsonText.length, (parseError.message.match(/\d+/)?.[0] || 0) + 100)));
        throw parseError;
      }
      
      console.log('✅ Successfully parsed JSON');
      console.log('📊 HTML length:', parsed.html?.length || 0);
      console.log('📊 CSS length:', parsed.css?.length || 0);
      console.log('📊 JS length:', parsed.javascript?.length || 0);
      console.log('🔍 First 200 chars of HTML:', parsed.html?.substring(0, 200));
      
      // Format HTML with basic indentation
      const formatHTML = (html) => {
        if (!html) return '';
        let formatted = html;
        let indent = 0;
        const tab = '  ';
        
        // Add newlines after tags
        formatted = formatted.replace(/></g, '>\n<');
        
        // Basic indentation
        const lines = formatted.split('\n');
        const result = [];
        
        lines.forEach(line => {
          const trimmed = line.trim();
          if (!trimmed) return;
          
          // Decrease indent for closing tags
          if (trimmed.startsWith('</')) {
            indent = Math.max(0, indent - 1);
          }
          
          result.push(tab.repeat(indent) + trimmed);
          
          // Increase indent for opening tags (not self-closing)
          if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
            indent++;
          }
        });
        
        return result.join('\n');
      };
      
      const formatCSS = (css) => {
        if (!css) return '';
        return css
          .replace(/\{/g, ' {\n  ')
          .replace(/;/g, ';\n  ')
          .replace(/\}/g, '\n}\n\n')
          .replace(/\n\s*\n\s*\n/g, '\n\n')
          .trim();
      };
      
      // Don't format JavaScript - keep it as-is to avoid breaking syntax
      const formatJS = (js) => {
        if (!js) return '';
        // Just return as-is - complex formatting can break code
        return js;
      };
      
      return {
        html: formatHTML(parsed.html),
        css: formatCSS(parsed.css),
        javascript: parsed.javascript || '', // Don't format JS
        components: parsed.components || [],
        description: parsed.description || ''
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error(`Failed to generate website: ${error.message}`);
    }
  }

  /**
   * Generate content for specific sections
   * @param {string} sectionType - Type of content (heading, paragraph, etc.)
   * @param {string} context - Context for content generation
   * @returns {string} Generated content
   */
  async generateContent(sectionType, context) {
    try {
      const promptText = `You are a creative copywriter. Generate engaging, professional content for websites.\n\nGenerate ${sectionType} content for: ${context}`;
      
      const result = await this.model.generateContent(promptText);
      const response = await result.response;
      
      return response.text().trim();
    } catch (error) {
      console.error('Content Generation Error:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  /**
   * Improve existing code
   * @param {Object} code - Existing HTML, CSS, JS code
   * @param {string} improvements - Requested improvements
   * @returns {Object} Improved code
   */
  async improveCode(code, improvements) {
    try {
      const prompt = `Improve the following website code based on these requirements: ${improvements}

Current HTML:
${code.html}

Current CSS:
${code.css}

Current JavaScript:
${code.javascript || 'None'}

Return improved code in JSON format with html, css, and javascript fields.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      let jsonText = text;
      const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      } else if (text.includes('```')) {
        const codeMatch = text.match(/```\s*([\s\S]*?)```/);
        if (codeMatch) jsonText = codeMatch[1];
      }

      return JSON.parse(jsonText.trim());
    } catch (error) {
      console.error('Code Improvement Error:', error);
      throw new Error(`Failed to improve code: ${error.message}`);
    }
  }
}

module.exports = new AIService();
