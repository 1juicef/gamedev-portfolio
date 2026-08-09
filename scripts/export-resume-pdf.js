#!/usr/bin/env node
// Reproducible resume PDF export.
//
// Serves the already-built dist/ output over a local, ephemeral, loopback-only
// HTTP server, drives a system-installed headless Chrome against the /resume
// route via --print-to-pdf, and writes the resulting PDF into
// public/downloads/. Zero new npm dependencies — Node builtins only.
//
// This script reads a build, it does not produce one. Run `npm run build`
// first (or use `npm run export:resume-pdf`, which chains both).
//
// Run with: node scripts/export-resume-pdf.js

"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const url = require("url");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const OUT_DIR = path.join(ROOT, "public", "downloads");
const OUT_PDF = path.join(OUT_DIR, "Josef-Ubaka-Resume.pdf");
// ?pdf=1 tells Resume.vue to render the condensed one-page dataset
// (no project-meta lines, no Beyond the Code section) instead of the
// full content shown to normal visitors on the live /resume route.
const ROUTE = "/#/resume?pdf=1";

const CONTENT_TYPES = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".map": "application/json",
    ".ttf": "font/ttf",
    ".woff2": "font/woff2",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".json": "application/json",
    ".pdf": "application/pdf",
};

function assertBuildExists() {
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        throw new Error(
            `dist/index.html not found — run \`npm run build\` first (this script reads a build, it does not produce one).`
        );
    }
}

// Resolves a system Chrome/Chromium binary. CHROME_PATH overrides everything.
function resolveChrome() {
    if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
        return process.env.CHROME_PATH;
    }
    const candidates = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        process.env.LOCALAPPDATA
            ? path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "Application", "chrome.exe")
            : null,
        "/usr/bin/google-chrome",
        "/usr/bin/chromium",
    ].filter(Boolean);
    for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
            return candidate;
        }
    }
    throw new Error(
        "Could not locate a system Chrome/Chromium install. Set CHROME_PATH to override."
    );
}

// Static file server over DIST, bound to 127.0.0.1 on an ephemeral port.
// Rejects any resolved path that escapes DIST (403) — defeats ../ traversal
// (T-fe8-02 mitigation).
function startServer() {
    return new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            let pathname;
            try {
                pathname = decodeURIComponent(url.parse(req.url).pathname || "/");
            } catch (err) {
                res.writeHead(400);
                res.end("Bad request");
                return;
            }
            if (pathname === "/") {
                pathname = "/index.html";
            }
            const resolved = path.join(DIST, pathname);
            const distRootWithSep = DIST + path.sep;
            if (resolved !== DIST && !resolved.startsWith(distRootWithSep)) {
                res.writeHead(403);
                res.end("Forbidden");
                return;
            }
            fs.readFile(resolved, (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end("Not found");
                    return;
                }
                const ext = path.extname(resolved).toLowerCase();
                res.writeHead(200, {
                    "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
                });
                res.end(data);
            });
        });
        server.on("error", reject);
        server.listen(0, "127.0.0.1", () => resolve(server));
    });
}

function assertPdfOutput() {
    if (!fs.existsSync(OUT_PDF)) {
        throw new Error(`Expected PDF was not written: ${OUT_PDF}`);
    }
    const fd = fs.openSync(OUT_PDF, "r");
    const magic = Buffer.alloc(5);
    fs.readSync(fd, magic, 0, 5, 0);
    fs.closeSync(fd);
    if (magic.toString("utf8") !== "%PDF-") {
        throw new Error(`Output file does not start with the PDF magic bytes: ${OUT_PDF}`);
    }
    const { size } = fs.statSync(OUT_PDF);
    if (size <= 20000) {
        throw new Error(`Output PDF is suspiciously small (${size} bytes): ${OUT_PDF}`);
    }
    if (size >= 5000000) {
        throw new Error(`Output PDF is suspiciously large (${size} bytes): ${OUT_PDF}`);
    }
    return size;
}

async function main() {
    assertBuildExists();
    const chromePath = resolveChrome();

    fs.mkdirSync(OUT_DIR, { recursive: true });

    const server = await startServer();
    const { port } = server.address();
    // Throwaway profile so the export cannot attach to (or mutate) the
    // operator's already-open Chrome session (T-fe8-04 mitigation).
    const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "resume-pdf-"));

    try {
        const targetUrl = `http://127.0.0.1:${port}${ROUTE}`;
        const args = [
            "--headless",
            "--disable-gpu",
            "--no-first-run",
            "--no-default-browser-check",
            "--disable-extensions",
            `--user-data-dir=${profileDir}`,
            // Gives the lazy-loaded route chunk, webfonts, and Vue render time to
            // settle before Chrome captures the page.
            "--virtual-time-budget=20000",
            "--run-all-compositor-stages-before-draw",
            "--no-pdf-header-footer",
            `--print-to-pdf=${OUT_PDF}`,
            targetUrl,
        ];
        // If a future Chrome build ever rejects the bare --headless flag,
        // --headless=new is the documented substitute.
        await execFileAsync(chromePath, args);

        const size = assertPdfOutput();
        console.log(`export-resume-pdf: wrote ${OUT_PDF} (${size} bytes)`);
    } finally {
        server.close();
        fs.rmSync(profileDir, { recursive: true, force: true });
    }
}

if (require.main === module) {
    main().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = { resolveChrome, assertPdfOutput };
