/**
 * Export generated website code as downloadable files
 */
export const exportWebsite = (html, css, javascript, projectName = 'website') => {
  // Create a complete HTML file with embedded CSS and JS
  const completeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${javascript || ''}
  </script>
</body>
</html>`;

  // Create blob and download
  const blob = new Blob([completeHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export as separate files in a ZIP (requires JSZip library)
 * For now, we'll export as a single HTML file
 */
export const exportAsFiles = (html, css, javascript, projectName = 'website') => {
  exportWebsite(html, css, javascript, projectName);
};

/**
 * Copy code to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Format code for better readability
 */
export const formatCode = (code, language = 'html') => {
  // Basic formatting - in production, you might want to use a library like prettier
  return code;
};

/**
 * Generate preview URL for iframe
 */
export const generatePreviewURL = (html, css, javascript) => {
  // Extract body content if HTML includes full document structure
  let bodyContent = html;
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    bodyContent = bodyMatch[1];
  }
  
  // Extract head content if present
  let headContent = '';
  const headMatch = html.match(/<head[^>]*>([\s\S]*)<\/head>/i);
  if (headMatch) {
    headContent = headMatch[1];
  }
  
  const completeHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${headContent}
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
${css}
  </style>
</head>
<body>
${bodyContent}
  <script>
${javascript || ''}
  </script>
</body>
</html>`;

  const blob = new Blob([completeHTML], { type: 'text/html' });
  return URL.createObjectURL(blob);
};
