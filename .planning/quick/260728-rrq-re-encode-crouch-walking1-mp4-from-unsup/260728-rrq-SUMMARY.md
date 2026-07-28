---
quick_id: 260728-rrq
status: complete
---

# Quick Task 260728-rrq: Summary

**Root cause confirmed:** `public/img/other-stuff/Crouch walking1.mp4` was encoded as legacy MPEG-4 Part 2 (`codec_name=mpeg4`, `codec_tag_string=mp4v`, Simple Profile), a codec no modern browser's `<video>` element supports (Chrome/Firefox/Safari/Edge support H.264, VP8/VP9, AV1 only). This is why the clip permanently showed a gray box — the browser found no decoder and the element never left `readyState 0`. The other two gallery clips are H.264 and always played fine. A prior autoplay-hardening pass (260728-rml: `preload="auto"`, explicit `.load()`, `loadedmetadata` retry) could not have fixed this since the failure was codec-level, not timing-level — confirmed by the user still seeing the gray box after a hard refresh post-hardening.

**Fix applied:** Re-encoded the file in place via ffmpeg to H.264 (yuv420p, `+faststart`, crf 20), same filename and dimensions (720x1280), audio stripped (source had none). File size dropped from 1,118,054 to 471,005 bytes.

**Files touched:** `public/img/other-stuff/Crouch walking1.mp4` (binary replacement only — no source/component changes; `src/views/OtherStuff.vue` markup and filename references are untouched and still correct).

**Verification performed:**
- `ffprobe` on the replaced file: `codec_name=h264`, `codec_tag_string=avc1`, `720x1280`, duration 3.27s
- `npm run build` — passes
- `git diff --stat` will show exactly one binary file changed

**Coverage gap:** This session's browser-automation sandbox stalls all video network fetches indiscriminately (confirmed via a control test against a known-good external MP4), so actual in-browser playback could not be verified here. The user must confirm in their real browser that the clip now plays. If it still doesn't, that points to something other than codec support (e.g. a CDN/hosting transcoding step reintroducing an unsupported format on deploy) and needs to be reported rather than assumed fixed.
