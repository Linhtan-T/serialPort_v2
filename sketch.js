// Works in Chrome/Edge/Opera over HTTPS (GitHub Pages). Not in Safari (no Web Serial).
let pot = 0;                // 0..1023 expected from Arduino
let port, reader;           // Web Serial objects
let connectBtn, statusEl;

function setup() {
  createCanvas(600, 400);
  noStroke();
  connectBtn = document.getElementById('connect');
  statusEl = document.getElementById('status');
  connectBtn.addEventListener('click', connectSerial);
}

function draw() {
  background(32);
  const x = map(pot, 0, 1023, 20, width - 20);
  fill(0, 200, 255);
  circle(x, height/2, 40);

  fill(255);
  textSize(14);
  text(`pot: ${pot}`, 10, 24);
}

async function connectSerial() {
  try {
    // Ask user to pick a serial device (needs a user gesture)
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });

    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader();

    statusEl.textContent = 'connected';
    connectBtn.disabled = true;

    // Read line-by-line (expects Arduino sending println)
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      let idx;
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        const v = parseInt(line, 10);
        if (!Number.isNaN(v)) pot = constrain(v, 0, 1023);
      }
    }
  } catch (e) {
    console.error(e);
    statusEl.textContent = 'error / cancelled';
  }
}

async function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
