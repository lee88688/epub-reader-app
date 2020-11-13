import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function useQuery() {
  const location = useLocation();
  return new URLSearchParams(location.search);
}

export function useRendered(renderState) {
  const [rendered, setRendered] = useState(!!renderState);

  useEffect(() => {
    if (renderState && !rendered) {
      setRendered(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderState]);

  return [rendered, renderState];
}
