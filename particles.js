
const NUM_PARTICLES = isMobile() ? 500 : 1000; // Fewer particles on mobile
const PARTICLE_SIZE = 0.4; // View heights
const SPEED = 40000; // Milliseconds
let particles = [];

function randomNormal({ mean = 10, dev = 1 }) {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + dev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function rand(low, high) {
  return Math.random() * (high - low) + low;
}

function isMobile() {
  return window.innerWidth <= 768;
}

function createParticle(canvas) {
  const isMobileDevice = isMobile();
  const colour = {
    r: rand(100, 203),
    g: randomNormal({ mean: 100, dev: 15 }),
    b: rand(110, 125),
    a: rand(.8, 1.5),
  };

  const config = {
    x: isMobileDevice ? rand(-1, 1) : -2,
    y: isMobileDevice ? rand(-1, 1) : -2,
    diameter: Math.max(0, randomNormal({
      mean: PARTICLE_SIZE * (isMobileDevice ? 0.75 : 1),
      dev: PARTICLE_SIZE / (isMobileDevice ? 3 : 2)
    })),
    duration: randomNormal({ mean: SPEED * (isMobileDevice ? 0.8 : 1), dev: SPEED * 0.25 }),
    amplitude: randomNormal({ mean: isMobileDevice ? -10 : -30, dev: 5 }),
    offsetY: randomNormal({ mean: isMobileDevice ? -45 : 5, dev: 10 }),
    arc: Math.PI * ((isMobileDevice ? -0.5 : -1) / 2),
    startTime: performance.now() - rand(0, SPEED),
    colour: `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`,
  };

  return config;
}

function moveParticle(particle, canvas, time) {
  const progress = ((time - particle.startTime) % particle.duration) / particle.duration;
  return {
    ...particle,
    x: progress,
    y: ((Math.sin(progress * particle.arc) * particle.amplitude) + particle.offsetY),
  };
}

function drawParticle(particle, canvas, ctx) {
  const vh = canvas.height / 100;
  ctx.fillStyle = particle.colour;
  ctx.beginPath();
  ctx.ellipse(
    particle.x * canvas.width,
    particle.y * vh + (canvas.height / 2),
    particle.diameter * vh,
    particle.diameter * vh,
    0,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

function draw(time, canvas, ctx) {
  particles.forEach((particle, index) => {
    particles[index] = moveParticle(particle, canvas, time);
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    drawParticle(particle, canvas, ctx);
  });

  requestAnimationFrame((time) => draw(time, canvas, ctx));
}

function initializeCanvas() {
  let canvas = document.getElementById('particle-canvas');
  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  let ctx = canvas.getContext("2d");

  window.addEventListener('resize', debounce(() => {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx = canvas.getContext("2d");
  }, 250));

  return [canvas, ctx];
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function startAnimation() {
  const [canvas, ctx] = initializeCanvas();
  particles = [];
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(createParticle(canvas));
  }
  requestAnimationFrame((time) => draw(time, canvas, ctx));
}

(function() {
  if (document.readyState !== 'loading') {
    startAnimation();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      requestIdleCallback(startAnimation);
    });
  }
}());
