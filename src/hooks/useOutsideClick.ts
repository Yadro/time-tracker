import { MutableRefObject, useEffect } from 'react';

export default function useOutsideClick(
  ref: MutableRefObject<any>,
  fn: Function
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        fn();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, fn]);
}
