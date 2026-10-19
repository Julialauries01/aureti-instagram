// Tiny deterministic timeline for Aureti motions (no GSAP: it crashed headless Edge here).
// A scene calls scene(duration, render) where render(t) sets every style for time t.
// render.cjs drives it through window.tl.seek(t) / window.tl.duration().
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, u) => a + (b - a) * u;
const E = {
  out: u => 1 - Math.pow(1 - u, 3),
  in: u => u * u * u,
  inOut: u => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
  back: u => { const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); },
};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
// set transform/opacity in one call: css(el, { x, y, s, r, ry, o })
function css(el, { x = 0, y = 0, s = 1, r = 0, ry = 0, o = 1 } = {}) {
  el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg) rotateY(${ry}deg) scale(${Math.max(s, 0.001)})`;
  el.style.opacity = o;
}
// element rising in: u from 0..1 -> slides up `dist` px and fades in
function rise(el, u, dist = 80) { const e = E.out(u); css(el, { y: (1 - e) * dist, o: e }); }
function pop(el, u) { const e = u <= 0 ? 0 : E.back(u); css(el, { s: e, o: clamp(u * 3) }); }
function scene(duration, render) {
  window.tl = { duration: () => duration, seek: t => render(t) };
  render(0);
}
