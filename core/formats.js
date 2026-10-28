// Formats — what the video is for. Pick one per episode with "meta.format" (default landscape).
// A format sets the canvas, where the title sits, the content area every layout divides, the caption style,
// the progress indicator, and the platform's safe zones (areas covered by the app's own UI).
//   area.title = content box when the scene has a title · area.bare = content box without one   ([x, y, w, h])
//   sub.mode: "pill" (long-form karaoke subtitle) | "pop" (short-form: 1–3 big words at a time, the spoken word lit)
//   safe: margins the platform UI covers (vertical: top bar, right action rail, bottom caption/description block)
//   ui: interface scale for compose elements — they lay out at slot ÷ ui and are scaled up, so phone-first formats get bigger type
(() => {
  window.FORMATS = {
    landscape: { name: 'landscape', about: '16:9 long-form (YouTube). 1920×1080.', W: 1920, H: 1080, ui: 1,
      header: { x: 88, y: 64, w: 1744, size: 62, wrap: false }, area: { title: [88, 240, 1744, 632], bare: [88, 110, 1744, 800] },
      sub: { mode: 'pill', bottom: 1036, max: 54, size: 31 }, safe: null, progress: 'chapters' },
    vertical: { name: 'vertical', about: '9:16 short-form (YouTube Shorts, TikTok, Reels). 1080×1920. Keep text out of the bottom 470 px and the right 132 px (the content area already does).', W: 1080, H: 1920, ui: 1.5,
      header: { x: 72, y: 236, w: 876, size: 74, wrap: true }, area: { title: [72, 500, 876, 790], bare: [72, 236, 876, 1054] },
      sub: { mode: 'pop', y: 1372, max: 16, size: 86 }, safe: { top: 200, right: 132, bottom: 470, left: 40 }, progress: 'none' },
    square: { name: 'square', about: '1:1 feed post (Instagram, LinkedIn, X). 1080×1080.', W: 1080, H: 1080, ui: 1.15,
      header: { x: 64, y: 58, w: 952, size: 54, wrap: true }, area: { title: [64, 236, 952, 640], bare: [64, 96, 952, 780] },
      sub: { mode: 'pill', bottom: 1044, max: 40, size: 30 }, safe: null, progress: 'bar' },
    portrait: { name: 'portrait', about: '4:5 feed video (Instagram, Facebook). 1080×1350.', W: 1080, H: 1350, ui: 1.2,
      header: { x: 64, y: 64, w: 952, size: 58, wrap: true }, area: { title: [64, 270, 952, 830], bare: [64, 110, 952, 990] },
      sub: { mode: 'pill', bottom: 1300, max: 40, size: 31 }, safe: null, progress: 'bar' },
  };
  window.FORMATS.short = window.FORMATS.vertical; // alias
})();
