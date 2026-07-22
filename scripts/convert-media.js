#!/usr/bin/env node
// One-time, dev-machine media conversion pipeline (not shipped to the browser).
//
// Converts source GIF/PNG masters in public/img/projects/<project>/ into
// compressed web-ready assets (MP4 video thumbnails, WebP posters, WebP
// screenshots) via ffmpeg + sharp. Source masters are never modified or
// deleted (D-03) — every conversion writes a new sibling file.
//
// Run with: node scripts/convert-media.js

"use strict";

const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

const PROJECTS_ROOT = path.join(__dirname, "..", "public", "img", "projects");

function assertSourceExists(sourcePath) {
    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Source file missing: ${sourcePath}`);
    }
}

// Converts a source GIF to a muted, web-optimized H.264 MP4.
// Uses execFile with an argument array (never a concatenated shell string)
// to avoid shell interpretation of filenames (T-01-01 mitigation).
// options.durationSeconds (optional): when set, appends ffmpeg's `-t` flag
// so encoding stops once that many seconds of input have been written,
// trimming trailing content (G-01-5 mitigation, T-01-06).
async function gifToMp4(inputGif, outputMp4, options = {}) {
    assertSourceExists(inputGif);
    const args = ["-y", "-i", inputGif];
    if (options.durationSeconds) {
        args.push("-t", String(options.durationSeconds));
    }
    args.push(
        "-movflags", "+faststart",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
        "-c:v", "libx264", "-crf", "28", "-preset", "veryslow",
        "-an",
        outputMp4,
    );
    await execFileAsync("ffmpeg", args);
    const trimSuffix = options.durationSeconds ? ` (trimmed to ${options.durationSeconds}s)` : "";
    console.log(`gifToMp4: ${outputMp4}${trimSuffix}`);
}

// Extracts the first frame of a source GIF as a temporary PNG, then pipes it
// through the same sharp WebP pipeline used for screenshots (toWebp) to
// produce the final compressed poster, deleting the temp PNG afterward.
async function extractPoster(inputGif, outputPosterWebp) {
    assertSourceExists(inputGif);
    const tempPng = outputPosterWebp.replace(/\.webp$/, ".tmp.png");
    await execFileAsync("ffmpeg", [
        "-y",
        "-i", inputGif,
        "-vframes", "1",
        tempPng,
    ]);
    await toWebp(tempPng, outputPosterWebp);
    fs.unlinkSync(tempPng);
    console.log(`extractPoster: ${outputPosterWebp}`);
}

// Converts a source PNG (or the temp poster PNG) to a compressed WebP.
// quality: 82 sits inside D-12's ~80-85% "still looks crisp" target.
// resize to width 1000 (withoutEnlargement) is free savings given screenshots
// display at a CSS cap of ~400px desktop (retina 2x = ~800px) — never
// upscales already-small sources.
async function toWebp(inputPath, outputPath) {
    assertSourceExists(inputPath);
    const sharp = require("sharp");
    await sharp(inputPath)
        .resize({ width: 1000, withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toFile(outputPath);
    console.log(`toWebp: ${outputPath}`);
}

// Video thumbnail manifest: [projectFolder, gifBasename, options?]
// Source GIF per D-10 (drag-rush/dispater), D-11 (floor-0), D-15 (swing-space).
// The optional 3rd element is Floor-0-specific (G-01-5 trim) — not a general
// pattern; the other 3 entries intentionally stay plain 2-element arrays.
const videoAssets = [
    ["drag-rush", "DragRushGif"],
    ["dispater", "DispaterGif2"],
    ["floor-0", "Floor0gif1", { durationSeconds: 12.5 }],
    ["swing-space", "SwingSpaceGIF3"],
];

async function convertVideos() {
    for (const [folder, basename, options] of videoAssets) {
        const inputGif = path.join(PROJECTS_ROOT, folder, `${basename}.gif`);
        const outputMp4 = path.join(PROJECTS_ROOT, folder, `${basename}.mp4`);
        const outputPoster = path.join(PROJECTS_ROOT, folder, `${basename}-poster.webp`);
        await gifToMp4(inputGif, outputMp4, options || {});
        await extractPoster(inputGif, outputPoster);
    }
}

// Screenshot manifest: [projectFolder, [pngBasenames...]]
const screenshotAssets = [
    ["drag-rush", ["DragrushSC1", "DragrushSC2", "DragrushSC3", "DragrushSC4", "DragrushSC5"]],
    ["dispater", ["DispaterSC1", "DispaterSC2", "DispaterSC3", "DispaterSC4", "DispaterSC5"]],
    ["floor-0", ["Floor0SC1", "Floor0SC2", "Floor0SC3", "Floor0SC4"]],
    ["swing-space", ["SwingSpaceSC1", "SwingSpaceSC2"]],
];

async function convertScreenshots() {
    for (const [folder, basenames] of screenshotAssets) {
        for (const basename of basenames) {
            const inputPng = path.join(PROJECTS_ROOT, folder, `${basename}.png`);
            const outputWebp = path.join(PROJECTS_ROOT, folder, `${basename}.webp`);
            await toWebp(inputPng, outputWebp);
        }
    }
}

async function main() {
    await convertVideos();
    await convertScreenshots();
    console.log("Done.");
}

if (require.main === module) {
    main().catch((err) => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = { gifToMp4, extractPoster, toWebp };
