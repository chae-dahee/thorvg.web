import { ShowcaseExample } from './types';

export const canvasResizeExample: ShowcaseExample = {
  id: 'canvas-resize',
  title: 'Canvas Resize',
  description: 'Resize a WebCanvas while preserving its logical layout',
  category: 'advanced',
  code: `import { init } from '@thorvg/webcanvas';

const TVG = await init({
  renderer: 'gl',
  locateFile: (path) => '/webcanvas/' + path.split('/').pop()
});

const canvas = new TVG.Canvas('#canvas', {
  width: 600,
  height: 600,
});

const SIZES = [320, 450, 600];
let current = 0;

(async () => {
  //Load a necessary font data.
  const response = await fetch('/fonts/PublicSans-Regular.ttf');
  const buffer = await response.arrayBuffer();
  TVG.Font.load('PublicSans-Regular', new Uint8Array(buffer), { type: 'ttf' });

  function draw() {
    const size = SIZES[current];

    //resize() syncs the CSS box, the backing store, and the scene scale at once
    canvas.resize(size, size);
    canvas.clear();

    //Backing store is the logical size multiplied by the DPR
    const dpr = canvas.dpr;
    const backingSize = Math.floor(size * dpr);

    //Background: reveals the current canvas bounds
    const background = new TVG.Shape();
    background.appendRect(0, 0, size, size);
    background.fill(30, 32, 40);
    background.stroke({ width: 2, color: [110, 118, 135, 255] });
    canvas.add(background);

    //Circle: stays centered because positions are recomputed from the logical size
    const circle = new TVG.Shape();
    circle.appendCircle(size / 2, size / 2, size * 0.18, size * 0.18);
    circle.fill(0, 255, 0, 255);
    circle.stroke({ width: 3, color: [255, 255, 255, 255] });
    canvas.add(circle);

    //Size information
    const lines = [
      \`Logical Size: \${size} x \${size}\`,
      \`DPR: \${dpr.toFixed(2)}\`,
      \`Backing Store Size: \${backingSize} x \${backingSize}\`,
      'Click to resize'
    ];

    lines.forEach((line, i) => {
      const text = new TVG.Text();
      text.font('PublicSans-Regular')
        .fontSize(16)
        .text(line)
        .fill(255, 255, 255)
        .translate(20, 20 + i * 26);
      canvas.add(text);
    });

    canvas.render();
  }

  //canvas.dpr is refreshed during render(), so sync it before the first read
  canvas.render();

  const canvasElement = document.querySelector('#canvas');
  if (canvasElement) {
    canvasElement.onclick = () => {
      current = (current + 1) % SIZES.length;
      draw();
    };
  }

  draw();
})();
`
};
