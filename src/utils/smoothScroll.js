/**
 * Fast, buttery-smooth programmatic scrolling.
 * Glides rapidly and seamlessly to target in ~380ms with easeOutQuart deceleration.
 */
export function fastSmoothScroll(target, options = {}) {
  const { offset = -70, duration = 380 } = options;
  const element = typeof target === 'string' ? document.getElementById(target) : target;
  if (!element) return;

  const startY = window.scrollY;
  const elementRect = element.getBoundingClientRect();
  const targetY = Math.max(0, startY + elementRect.top + offset);
  const distance = targetY - startY;

  if (Math.abs(distance) < 4) return;

  const startTime = performance.now();

  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / duration);
    const easedProgress = easeOutQuart(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}
export default fastSmoothScroll;
