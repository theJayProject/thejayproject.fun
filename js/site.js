
(() => {
  const glow = document.querySelector('.cursor-glow');
  let frame = null, x = 0, y = 0;

  document.addEventListener('pointermove', e => {
    x = e.clientX;
    y = e.clientY;

    if (!frame && glow) {
      frame = requestAnimationFrame(() => {
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
        frame = null;
      });
    }
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const form = document.getElementById('subscribe-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('subscribe-feedback').textContent =
        'Signup is a visual demo only until the subscription service is connected.';
    });
  }

  // Hide ADMIN unless Cloudflare confirms the visitor's IP.
  const adminLink = document.querySelector('.login-link');

  if (adminLink) {
    adminLink.style.display = 'none';

    fetch('https://jay-admin-check-worker.joannawojtusiakit.workers.dev', {
      method: 'GET',
      cache: 'no-store'
    })
      .then(response => {
        if (!response.ok) throw new Error('IP check failed');
        return response.json();
      })
      .then(result => {
        if (result.allowed === true) {
          adminLink.style.display = '';
        }
      })
      .catch(() => {
        adminLink.style.display = 'none';
      });
  }

  // Offline cache
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
})();
