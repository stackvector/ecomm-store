const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 4173;
const root = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

http
  .createServer((req, res) => {
    const reqPath = decodeURIComponent(req.url.split("?")[0]);
    const cleanPath = reqPath === "/" ? "/index.html" : reqPath;
    const filePath = path.normalize(path.join(root, cleanPath));

    if (!filePath.startsWith(root)) {
      send(res, 403, "Forbidden");
      return;
    }

    fs.stat(filePath, (statErr, stats) => {
      if (statErr) {
        send(res, 404, "Not found");
        return;
      }

      const finalPath = stats.isDirectory() ? path.join(filePath, "index.html") : filePath;
      fs.readFile(finalPath, (readErr, data) => {
        if (readErr) {
          send(res, 404, "Not found");
          return;
        }

        const ext = path.extname(finalPath).toLowerCase();
        send(res, 200, data, mimeTypes[ext] || "application/octet-stream");
      });
    });
  })
  .listen(port, () => {
    console.log(`Local server running at http://localhost:${port}`);
  });
