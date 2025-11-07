(function () {
  const pi = Math.PI;
  const pi2 = 2 * Math.PI;

  function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }
  this.Waves = function (holder, options) {
    if (isMobile()) {
      console.log('Mobile detected, disabling waves animation.');
      return;
    }
    const Waves = this;

    Waves.options = Object.assign({
      resize: false,
      rotation: 25,
      waves: 5,
      width: 100,
      hue: [14, 14],
      amplitude: 0.6,
      background: true,
      preload: true,
      speed: [0.004, 0.008],
      debug: false,
      fps: false,
    }, options);

    Waves.waves = [];
    Waves.holder = document.querySelector(holder);
    Waves.canvas = document.createElement('canvas');
    Waves.ctx = Waves.canvas.getContext('2d');
    Waves.holder.appendChild(Waves.canvas);

    Waves.hue = Waves.options.hue[0];
    Waves.hueFw = true;
    Waves.stats = new Stats();

    Waves.resize();
    Waves.init(Waves.options.preload);

    if (Waves.options.resize) {
      let resizeTimeout;
      window.addEventListener('resize', () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => Waves.resize(), 100);
      }, false);
    }
  };

  Waves.prototype.init = function (preload) {
    const Waves = this;
    const options = Waves.options;

    for (let i = 0; i < options.waves; i++) {
      Waves.waves[i] = new Wave(Waves);
    }

    if (preload) Waves.preload();
  };

  Waves.prototype.preload = function () {
    const Waves = this;
    const options = Waves.options;

    // Preload wave updates (avoiding unnecessary animation)
    for (let i = 0; i < options.waves; i++) {
      Waves.updateColor();
      for (let j = 0; j < options.width; j++) {
        Waves.waves[i].update();
      }
    }
  };

  Waves.prototype.render = function () {
    const Waves = this;
    const ctx = Waves.ctx;
    const options = Waves.options;

    Waves.updateColor();
    Waves.clear();

    if (options.background) {
      Waves.background();
    }

    Waves.waves.forEach((wave) => {
      wave.update();
      wave.draw();
    });
  };

  Waves.prototype.animate = function () {
    const Waves = this;

    Waves.render();

    if (Waves.options.fps) {
      Waves.stats.log();
      Waves.ctx.font = '12px Arial';
      Waves.ctx.fillStyle = '#fff';
      Waves.ctx.fillText(`${Waves.stats.fps()} FPS`, 10, 22);
    }

    window.requestAnimationFrame(Waves.animate.bind(Waves));
  };

  Waves.prototype.clear = function () {
    const Waves = this;
    Waves.ctx.clearRect(0, 0, Waves.width, Waves.height);
  };

  Waves.prototype.background = function () {
    const Waves = this;
    const ctx = Waves.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, Waves.height);
    gradient.addColorStop(0, '#000');
    gradient.addColorStop(1, Waves.color);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, Waves.width, Waves.height);
  };

  Waves.prototype.resize = function () {
    const Waves = this;
    const width = Waves.holder.offsetWidth;
    const height = Waves.holder.offsetHeight;
    const scale = window.devicePixelRatio || 1;

    Waves.width = width * scale;
    Waves.height = height * scale;
    Waves.canvas.width = Waves.width;
    Waves.canvas.height = Waves.height;
    Waves.canvas.style.width = `${width}px`;
    Waves.canvas.style.height = `${height}px`;

    Waves.radius = Math.sqrt(Math.pow(Waves.width, 2) + Math.pow(Waves.height, 2)) / 2;
    Waves.centerX = Waves.width / 2;
    Waves.centerY = Waves.height / 2;
  };

  Waves.prototype.updateColor = function () {
    const Waves = this;

    Waves.hue += Waves.hueFw ? 0.01 : -0.01;

    if (Waves.hue > Waves.options.hue[1] && Waves.hueFw) {
      Waves.hue = Waves.options.hue[1];
      Waves.hueFw = false;
    } else if (Waves.hue < Waves.options.hue[0] && !Waves.hueFw) {
      Waves.hue = Waves.options.hue[0];
      Waves.hueFw = true;
    }

    const a = Math.floor(127 * Math.sin(0.3 * Waves.hue) + 128);
    const b = Math.floor(127 * Math.sin(0.3 * Waves.hue + 2) + 128);
    const c = Math.floor(127 * Math.sin(0.3 * Waves.hue + 4) + 128);

    Waves.color = `rgba(${a},${b},${c}, 0.1)`;
  };

  function Wave(Waves) {
    const Wave = this;
    const speed = Waves.options.speed;

    Wave.Waves = Waves;
    Wave.Lines = [];

    Wave.angle = [rnd(pi2), rnd(pi2), rnd(pi2), rnd(pi2)];
    Wave.speed = [
      rnd(speed[0], speed[1]) * rnd_sign(),
      rnd(speed[0], speed[1]) * rnd_sign(),
      rnd(speed[0], speed[1]) * rnd_sign(),
      rnd(speed[0], speed[1]) * rnd_sign(),
    ];

    return Wave;
  }

  Wave.prototype.update = function () {
    const Wave = this;
    const Lines = Wave.Lines;
    const color = Wave.Waves.color;

    Lines.push(new Line(Wave, color));

    if (Lines.length > Wave.Waves.options.width) {
      Lines.shift(); // Remove the oldest line if we exceed the max number
    }
  };

  Wave.prototype.draw = function () {
    const Wave = this;
    const Waves = Wave.Waves;
    const ctx = Waves.ctx;
    const radius = Waves.radius;
    const x = Waves.centerX;
    const y = Waves.centerY;
    const rotation = dtr(Waves.options.rotation);
    const amplitude = Waves.options.amplitude;
    const debug = Waves.options.debug;
    const Lines = Wave.Lines;

    Lines.forEach((line, i) => {
      if (debug && i > 0) return; // Skip all lines except the first one if debugging

      const angle = line.angle;
      const radius3 = radius / 3;
      const x1 = x - radius * Math.cos(angle[0] * amplitude + rotation);
      const y1 = y - radius * Math.sin(angle[0] * amplitude + rotation);
      const x2 = x + radius * Math.cos(angle[3] * amplitude + rotation);
      const y2 = y + radius * Math.sin(angle[3] * amplitude + rotation);
      const cpx1 = x - radius3 * Math.cos(angle[1] * amplitude * 2);
      const cpy1 = y - radius3 * Math.sin(angle[1] * amplitude * 2);
      const cpx2 = x + radius3 * Math.cos(angle[2] * amplitude * 2);
      const cpy2 = y + radius3 * Math.sin(angle[2] * amplitude * 2);

      ctx.strokeStyle = debug ? '#fff' : line.color;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
      ctx.stroke();

      if (debug) {
        ctx.strokeStyle = '#fff';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(cpx1, cpy1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(cpx2, cpy2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });
  };

  function Line(Wave, color) {
    const Line = this;
    const angle = Wave.angle;
    const speed = Wave.speed;

    Line.angle = [
      Math.sin(angle[0] += speed[0]),
      Math.sin(angle[1] += speed[1]),
      Math.sin(angle[2] += speed[2]),
      Math.sin(angle[3] += speed[3]),
    ];

    Line.color = color;
  }

  // FPS Stats class
  function Stats() {
    this.data = [];
  }

  Stats.prototype.time = function () {
    return performance.now();
  };

  Stats.prototype.log = function () {
    if (!this.last) {
      this.last = this.time();
      return 0;
    }

    this.new = this.time();
    this.delta = this.new - this.last;
    this.last = this.new;

    this.data.push(this.delta);
    if (this.data.length > 10) this.data.shift();
  };

  Stats.prototype.fps = function () {
    const fps = this.data.reduce((sum, data) => sum + data, 0);
    return Math.round(1000 / (fps / this.data.length));
  };

  function dtr(deg) {
    return deg * pi / 180;
  }

  function rnd(a, b) {
    return b === undefined ? Math.random() * a : a + Math.random() * (b - a);
  }

  function rnd_sign() {
    return Math.random() > 0.5 ? 1 : -1;
  }

})();

const waves = new Waves('#holder', {
  fps: true,
  waves: 3,
  width: 500,
});
if (waves) waves.animate();
