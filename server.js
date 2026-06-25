const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const FRUITS_CSV = path.join(ROOT, 'fruits.csv');

const categoryNames = {
  apple: '苹果',
  banana: '香蕉',
  orange: '橙子',
  strawberry: '草莓',
  grape: '葡萄',
  watermelon: '西瓜',
  pineapple: '凤梨',
  mango: '芒果',
  cherry: '车厘子',
  kiwi: '奇异果',
  peach: '桃子',
  blueberry: '蓝莓',
};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');

  return lines.map((line) => {
    const values = line.split(',');
    return headers.reduce((row, header, index) => {
      row[header] = values[index];
      return row;
    }, {});
  });
}

function getFruits() {
  const csv = fs.readFileSync(FRUITS_CSV, 'utf8');

  return parseCsv(csv).map((row) => ({
    id: Number(row.id),
    name: row.name,
    en: row.en,
    origin: row.origin,
    cat: row.cat,
    price: Number(row.price),
    unit: row.unit,
    img: row.img,
  }));
}

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function getCartQuote(cart) {
  const fruits = getFruits();
  const byId = new Map(fruits.map((fruit) => [fruit.id, fruit]));

  const items = Object.entries(cart || {}).flatMap(([id, quantity]) => {
    const fruit = byId.get(Number(id));
    const qty = Math.max(0, Number(quantity) || 0);

    if (!fruit || qty === 0) return [];

    return [{
      ...fruit,
      quantity: qty,
      subtotal: Number((fruit.price * qty).toFixed(2)),
    }];
  });

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = Number(items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));

  return { items, count, total };
}

async function handleApi(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/fruits') {
    sendJson(res, 200, getFruits());
    return;
  }

  if (req.method === 'GET' && pathname === '/api/categories') {
    const fruits = getFruits();
    const categories = [...new Set(fruits.map((fruit) => fruit.cat))].map((cat) => ({
      cat,
      name: categoryNames[cat] || cat,
    }));

    sendJson(res, 200, categories);
    return;
  }

  if (req.method === 'POST' && pathname === '/api/cart/quote') {
    try {
      const { cart } = await readJsonBody(req);
      sendJson(res, 200, getCartQuote(cart));
    } catch (error) {
      sendJson(res, 400, { error: 'Invalid JSON request body' });
    }
    return;
  }

  sendJson(res, 404, { error: 'API route not found' });
}

function serveStatic(req, res, pathname) {
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.normalize(path.join(ROOT, requestedPath));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const contentType = mimeTypes[path.extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    if (pathname.startsWith('/api/')) {
      await handleApi(req, res, pathname);
      return;
    }

    serveStatic(req, res, decodeURIComponent(pathname));
  } catch (error) {
    sendJson(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`Fresh fruit shop running at http://localhost:${PORT}`);
});
