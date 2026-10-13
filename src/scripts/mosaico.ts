// Mosaico de la portada: cada casilla rota entre fotos de Chris, por turnos, solo si se ve y sin movimiento reducido.
export function iniciarMosaico() {
  const raiz = document.querySelector<HTMLElement>('[data-mosaico]');
  if (!raiz || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const casillas = [...raiz.querySelectorAll<HTMLAnchorElement>('[data-casilla]')].filter((c) => c.children.length > 1);
  let turno = 0;
  let enVista = true;
  new IntersectionObserver(([e]) => (enVista = e.isIntersecting)).observe(raiz);
  setInterval(() => {
    if (!enVista || document.hidden || !casillas.length) return;
    const c = casillas[turno % casillas.length];
    turno++;
    if (getComputedStyle(c).display === 'none') return;
    const imgs = [...c.querySelectorAll<HTMLImageElement>('img')];
    const i = imgs.findIndex((x) => x.classList.contains('visible'));
    const sig = imgs[(i + 1) % imgs.length];
    // La nueva entra encima y la anterior se apaga cuando la nueva ya está completa: nunca dos fotos a medias.
    const mostrar = () => {
      sig.classList.add('visible', 'arriba');
      c.href = `/places/${sig.dataset.slug}`;
      setTimeout(() => { imgs[i]?.classList.remove('visible'); sig.classList.remove('arriba'); }, 950);
    };
    if (sig.complete) mostrar(); else { sig.loading = 'eager'; sig.addEventListener('load', mostrar, { once: true }); }
  }, 2600);
}
