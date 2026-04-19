const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const PORT = 3443;
const DIST_DIR = path.join(__dirname, 'dist');

// Generate self-signed certificate if it doesn't exist
const certDir = path.join(__dirname, '.certs');
const keyFile = path.join(certDir, 'key.pem');
const certFile = path.join(certDir, 'cert.pem');

if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

if (!fs.existsSync(keyFile) || !fs.existsSync(certFile)) {
  console.log('Generating self-signed SSL certificate...');
  const { exec } = require('child_process');
  const cmd = `openssl req -x509 -newkey rsa:4096 -keyout "${keyFile}" -out "${certFile}" -days 365 -nodes -subj "/CN=localhost"`;
  
  try {
    require('child_process').execSync(cmd);
    console.log('Certificate generated successfully');
  } catch (err) {
    console.warn('Could not generate certificate. Using simple HTTPS without cert validation.');
  }
}

// HTTPS server options
const options = {
  key: fs.existsSync(keyFile) ? fs.readFileSync(keyFile) : undefined,
  cert: fs.existsSync(certFile) ? fs.readFileSync(certFile) : undefined,
};

// Create HTTPS server
const server = https.createServer(options, (req, res) => {
  let filePath = path.join(DIST_DIR, req.url);
  
  // If it's a directory or root, serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  
  // Default to index.html for SPA routing
  if (!path.extname(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
      return;
    }

    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
    }[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const ip = getLocalIP();

server.listen(PORT, () => {
  console.log('\n================================');
  console.log('🔐 HTTPS Web Server Started');
  console.log('================================');
  console.log(`\n📱 Mobile Browser URL:`);
  console.log(`   https://${ip}:${PORT}`);
  console.log(`\n💻 Local URL:`);
  console.log(`   https://localhost:${PORT}`);
  console.log(`\n⚠️  Note: Self-signed certificate - browser may show security warning`);
  console.log(`   Click "Advanced" > "Proceed" to continue\n`);
});
