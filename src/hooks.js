import { useLocation } from 'react-router-dom';

export function useQuery() {
  const location = useLocation();
  return new URLSearchParams(location.search);
}
