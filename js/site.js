(() => {
  const glow = document.querySelector('.cursor-glow');
  let frame = null, x = 0, y = 0;
  document.addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    if (!frame) frame = requestAnimationFrame(() => {
      glow.style.left = x + 'px'; glow.style.top = y + 'px'; frame = null;
    });
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  const form = document.getElementById('subscribe-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('subscribe-feedback').textContent = 'Signup is a visual demo only until the subscription service is connected.';
  });
  // Offline cache: the shell and posts already loaded are cached. Avoid caching admin/login pages or APIs.
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('/sw.js').catch(() => {});
})();
