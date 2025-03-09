const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

// Handle module imports in browser
const handleModuleImports = (content, filePath) => {
  if (path.extname(filePath) === '.js') {
    // Replace require statements with proper browser imports
    return content
      .replace(/const\s+(\w+)\s*=\s*require\(['"](.+)['"]\);?/g, (match, varName, modulePath) => {
        // For local modules, convert to relative path
        if (modulePath.startsWith('./') || modulePath.startsWith('../')) {
          return `import * as ${varName} from '${modulePath}';\n`;
        } else {
          // For node modules, we'll need to handle differently
          return `// Browser doesn't support require for: ${modulePath}\n// Using global variable or mock instead\n`;
        }
      });
  }
  return content;
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Handle API proxy requests to Riot API
  if (req.url.startsWith('/api/')) {
    handleApiRequest(req, res);
    return;
  }
  
  // Handle root path
  let filePath = req.url === '/' 
    ? path.join(__dirname, 'index.html')
    : path.join(__dirname, req.url);
  
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Page not found
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading index.html');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Process content if needed (e.g., for module imports)
      const processedContent = handleModuleImports(content.toString(), filePath);
      
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(processedContent, 'utf-8');
    }
  });
});

// Handle API requests (proxy to Riot API)
function handleApiRequest(req, res) {
  // This is a simple API proxy implementation
  // In a production app, you would implement proper API key management and caching
  res.writeHead(501, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    error: 'API proxy not implemented',
    message: 'For security reasons, the Riot API key should not be exposed in client-side code. In a production environment, you would implement a proper backend API proxy with authentication and rate limiting.'
  }));
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Note: You need to replace the API key in config.js with your own Riot API key.`);
});
