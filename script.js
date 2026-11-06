'use strict';

const progress = document.getElementById('read-progress');
function updateProgress() {
  const available = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.width = `${available > 0 ? Math.min(100, scrollY / available * 100) : 0}%`;
}
addEventListener('scroll', updateProgress, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();

// Perspective projection supplies coherent front/back scale and occlusion.
// Native links remain DOM elements for keyboard and touch interaction.
const scene = document.querySelector('.tool-scene');
const objects = scene ? [...scene.querySelectorAll('.tool-object')] : [];
const motionButton = document.querySelector('.motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (scene && objects.length) {
  let frame = 0, lastTime = 0, phase = .24;
  let visible = false, paused = false, hover = false, focused = false;
  let width = scene.clientWidth;
  const rotations = [-8, 6, -5, 8, -7, 4, -4, 5, -6, 7];

  function positionObjects() {
    scene.classList.toggle('scene-static', reducedMotion.matches);
    if (reducedMotion.matches) return;
    const radius = (width - 108) * .48;
    const verticalRadius = width < 400 ? 97 : 106;
    objects.forEach((object, index) => {
      const angle = phase + index * Math.PI * 2 / objects.length;
      const depth = Math.sin(angle);
      const cameraScale = 650 / (650 - depth * 132);
      const x = Math.cos(angle) * radius * cameraScale;
      const y = (depth * verticalRadius - Math.cos(angle) * 32) * cameraScale;
      object.style.setProperty('--x', `${x.toFixed(2)}px`);
      object.style.setProperty('--y', `${y.toFixed(2)}px`);
      object.style.setProperty('--scale', cameraScale.toFixed(3));
      object.style.setProperty('--opacity', (.84 + (depth + 1) * .08).toFixed(3));
      object.style.setProperty('--turn', `${(-Math.cos(angle) * 23).toFixed(2)}deg`);
      object.style.setProperty('--roll', `${rotations[index] + Math.cos(angle) * 4}deg`);
      object.style.zIndex = depth > -.15 ? String(30 + Math.round(depth * 10)) : '10';
    });
  }
  function canAnimate() { return visible && !document.hidden && !reducedMotion.matches && !paused && !hover && !focused; }
  function tick(time) {
    frame = 0;
    if (!canAnimate()) { lastTime = 0; return; }
    if (lastTime) phase += Math.min(time - lastTime, 60) * Math.PI * 2 / 56000;
    lastTime = time;
    positionObjects();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    scene.classList.toggle('motion-paused', !canAnimate());
    if (canAnimate() && !frame) frame = requestAnimationFrame(tick);
    else if (!canAnimate() && frame) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
  }
  new ResizeObserver(() => { width = scene.clientWidth; positionObjects(); }).observe(scene);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .05 }).observe(scene);
  scene.addEventListener('pointerover', event => {
    if (event.pointerType === 'mouse') { hover = !!event.target.closest('.tool-object'); sync(); }
  });
  scene.addEventListener('pointerleave', () => { hover = false; sync(); });
  scene.addEventListener('focusin', () => { focused = true; sync(); });
  scene.addEventListener('focusout', event => { focused = scene.contains(event.relatedTarget); sync(); });
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', () => { positionObjects(); sync(); });
  motionButton.addEventListener('click', () => {
    paused = !paused;
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Play tool animation' : 'Pause tool animation');
    motionButton.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
    sync();
  });
  positionObjects();
}
