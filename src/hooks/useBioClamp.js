import { useLayoutEffect } from 'react';

function isInViewport(rect) {
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

export function useBioClamp(containerRef, deps) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const update = () => {
      const bios = container.querySelectorAll('.tutor-card__bio');

      // 1) Спочатку лише читаємо розміри. Клас is-clamped не знімаємо:
      //    scrollHeight — повна висота тексту, clientHeight — видима (3 рядки).
      const results = [];
      bios.forEach((bio) => {
        if (!isInViewport(bio.getBoundingClientRect())) return;
        results.push({ bio, hasMore: bio.scrollHeight > bio.clientHeight + 1 });
      });

      // 2) Потім лише записуємо класи — без читань між ними, тож немає forced reflow
      results.forEach(({ bio, hasMore }) => {
        bio.closest('.tutor-card').classList.toggle('has-more', hasMore);
      });
    };

    update();
    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, deps);
}
