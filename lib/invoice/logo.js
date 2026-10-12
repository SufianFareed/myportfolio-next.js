const MAX_FILE_BYTES = 3 * 1024 * 1024;
const MAX_W = 360;
const MAX_H = 140;

// Shrinks the uploaded logo so it stays small in localStorage and
// embeds cleanly in the PDF.
export function processLogoFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\/(png|jpe?g|webp|gif|svg\+xml)$/.test(file.type)) {
      reject(new Error("Please choose a PNG, JPG, WEBP or SVG image."));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error("Logo is too large. Please use an image under 3 MB."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That image could not be opened."));
      img.onload = () => {
        const naturalW = img.naturalWidth || img.width || MAX_W;
        const naturalH = img.naturalHeight || img.height || MAX_H;
        const ratio = Math.min(1, MAX_W / naturalW, MAX_H / naturalH);
        const w = Math.max(1, Math.round(naturalW * ratio));
        const h = Math.max(1, Math.round(naturalH * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        let dataUrl = canvas.toDataURL("image/png");
        if (dataUrl.length > 160000) {
          // Large PNGs get re-encoded as JPEG on white to save space.
          const flat = document.createElement("canvas");
          flat.width = w;
          flat.height = h;
          const fctx = flat.getContext("2d");
          fctx.fillStyle = "#ffffff";
          fctx.fillRect(0, 0, w, h);
          fctx.drawImage(img, 0, 0, w, h);
          dataUrl = flat.toDataURL("image/jpeg", 0.85);
        }
        resolve({ dataUrl, w, h });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
