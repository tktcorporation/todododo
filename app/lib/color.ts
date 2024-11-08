export async function extractColors(imageUrl: string): Promise<{
  primary: string;
  text: string;
  background: string;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(getDefaultColors());
        return;
      }

      // Use a smaller size for performance
      const size = 100;
      canvas.width = size;
      canvas.height = size;
      
      // Draw image scaled down for faster processing
      ctx.drawImage(img, 0, 0, size, size);

      try {
        const imageData = ctx.getImageData(0, 0, size, size).data;
        const colors = analyzeColors(imageData);
        resolve(colors);
      } catch (e) {
        resolve(getDefaultColors());
      }
    };

    img.onerror = () => {
      resolve(getDefaultColors());
    };

    img.src = imageUrl;
  });
}

function analyzeColors(imageData: Uint8ClampedArray) {
  let r = 0, g = 0, b = 0;
  let count = 0;
  
  // Sample pixels for better performance
  for (let i = 0; i < imageData.length; i += 16) { // Sample every 4th pixel
    r += imageData[i];
    g += imageData[i + 1];
    b += imageData[i + 2];
    count++;
  }

  const avgR = Math.round(r / count);
  const avgG = Math.round(g / count);
  const avgB = Math.round(b / count);

  // Calculate perceived brightness using relative luminance
  const brightness = (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255;
  const isDark = brightness < 0.5;

  // Generate a more saturated primary color
  const hsl = rgbToHsl(avgR, avgG, avgB);
  const saturatedRgb = hslToRgb(hsl.h, Math.min(1, hsl.s * 1.5), 0.5);

  return {
    primary: `rgb(${saturatedRgb.r}, ${saturatedRgb.g}, ${saturatedRgb.b})`,
    text: isDark ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
    background: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)',
  };
}

function getDefaultColors() {
  return {
    primary: 'rgb(37, 99, 235)', // blue-600
    text: 'rgb(0, 0, 0)',
    background: 'rgba(255, 255, 255, 0.9)',
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}