---
quick_id: 260728-rrq
status: planned
---

# Quick Task 260728-rrq: Re-encode Crouch walking1.mp4 to H.264

## Root cause

User reported one gallery video ("the video down to the left") permanently stuck as a gray box in the Other Stuff masonry gallery, surviving hard refresh. A prior quick task (260728-rml) applied defensive autoplay hardening (`preload="auto"`, explicit `.load()`, `loadedmetadata` retry) which did not fix it — ruling out a timing/race explanation.

User confirmed the stuck clip is `Crouch walking1.mp4`. `ffprobe` showed:

```
codec_name=mpeg4
codec_tag_string=mp4v
profile=Simple Profile
```

This is legacy MPEG-4 Part 2 (ISO/IEC 14496-2, "Simple Profile" / historically associated with Xvid/DivX-style encodes) inside an `.mp4` container tagged `mp4v`. Chrome, Firefox, Safari, and Edge only support H.264 (`avc1`), VP8/VP9, and AV1 for `<video>` — none support raw MPEG-4 Part 2. The browser's media pipeline finds no usable decoder for the video track and the element never advances past `readyState 0` — hence a permanent gray box with no console error (this is exactly the class of silent decoder-mismatch failure; the other two clips in the gallery are H.264 and play fine).

## Task

**Files:** `public/img/other-stuff/Crouch walking1.mp4` (binary asset replacement only — no code changes)

**Action:** Re-encode in place via ffmpeg to H.264/yuv420p with `+faststart` (moov atom moved to front for progressive playback), same filename/dimensions (720x1280), audio stripped (source had none). Already performed and verified during diagnosis:

```
ffmpeg -y -i "Crouch walking1.mp4" -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -movflags +faststart -crf 20 -preset medium -an "Crouch walking1.h264.mp4"
mv "Crouch walking1.h264.mp4" "Crouch walking1.mp4"
```

Result verified via `ffprobe`: `codec_name=h264`, `codec_tag_string=avc1`, `720x1280` preserved, duration `3.27s`. File size dropped 1,118,054 → ~471,005 bytes (H.264 far more efficient than legacy MPEG-4 Part 2 at comparable quality).

**Verify:**
- `ffprobe` on the replaced file confirms `codec_name=h264` (not `mpeg4`)
- `git diff --stat` shows exactly one binary file changed, no source files touched
- `npm run build` still passes (asset path/filename unchanged, no code impact)

**Done when:** File replaced, committed, `npm run build` green, STATE.md updated.

## Notes

This is a straight asset-compatibility fix, not a feature change — `src/views/OtherStuff.vue` requires no edit since the filename and video tag markup are unchanged. Still owed to the user: confirm in their real browser that the clip now plays (this session's browser-automation sandbox stalls all video fetches indiscriminately, so it cannot verify browser playback — only the file's own codec/container was verified via ffprobe).
