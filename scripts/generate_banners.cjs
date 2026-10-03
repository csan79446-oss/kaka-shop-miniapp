const { execSync } = require('child_process');
const fs = require('fs');

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

console.log('Generating branded 640x360 Telegram Bot banners...');

// 1. Download vibrant 3D e-commerce shopping bag / digital store graphic
try {
  execSync(`curl -sSL "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?w=1280&q=90" -o /tmp/shopping.jpg`);
  
  // Composite into custom branded 640x360 banner
  execSync(`
    convert /tmp/shopping.jpg \
      -resize 640x360^ -gravity center -extent 640x360 \
      -fill "rgba(15, 33, 54, 0.45)" -draw "rectangle 0,0 640,360" \
      -font DejaVu-Sans-Bold -pointsize 42 -fill white -gravity center -annotate -0-40 "PHSAR24" \
      -pointsize 20 -fill "#38bdf8" -gravity center -annotate -0+15 "Online Marketplace in Cambodia" \
      -pointsize 14 -fill "#cbd5e1" -gravity center -annotate -0+55 "Telegram MiniApp • KHQR • Fast Delivery" \
      public/telegram-bot-640x360.png
  `);

  execSync(`convert public/telegram-bot-640x360.png -quality 95 public/telegram-bot-640x360.jpg`);

  // Also create a clean modern gradient illustration version (Version 2)
  execSync(`
    convert -size 640x360 gradient:"#0f172a"-"#0284c7" \
      -fill "rgba(255,255,255,0.06)" -draw "circle 120,60 180,60" \
      -fill "rgba(255,255,255,0.04)" -draw "circle 520,300 620,300" \
      -fill "#0088cc" -draw "roundrectangle 200,60 440,130 18,18" \
      -font DejaVu-Sans-Bold -pointsize 32 -fill white -gravity center -annotate -0-75 "PHSAR24" \
      -pointsize 18 -fill "#f1f5f9" -gravity center -annotate -0-10 "Telegram MiniApp Store" \
      -pointsize 14 -fill "#38bdf8" -gravity center -annotate -0+30 "24/7 Digital Shopping & Multi-Vendor" \
      -fill "#10b981" -draw "roundrectangle 220,250 420,295 12,12" \
      -pointsize 14 -fill white -gravity center -annotate -0+92 "OPEN STORE NOW" \
      public/telegram-miniapp-splash-640x360.png
  `);

  console.log('Banners created successfully!');
} catch (err) {
  console.error('Error generating banners:', err.message);
}
