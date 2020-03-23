import { useRef, useEffect } from 'react';

export const useFlasher = () => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.setAttribute(
      'style',
      'box-shadow: 0 0 4px 1px orange; transition: box-shadow 400ms ease-out;',
    );
    setTimeout(() => {
      if (!ref.current) return;
      ref.current.setAttribute('style', '');
    }, 800);
  });
  return ref;
};
