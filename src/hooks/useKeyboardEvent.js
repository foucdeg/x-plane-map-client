/* globals window */
import { useEffect } from 'react';

export default function useKeyboardEvent(key, callback) {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === key) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });
}
