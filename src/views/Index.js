import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useQuery } from '../hooks';

export default function Index() {
  const history = useHistory();
  const query = useQuery();
  const redirect = query.get('redirect');
  const isLogin = Cookies.get('isLogin');
  if (redirect && isLogin) {
    history.replace(redirect);
    return null;
  }
  if (isLogin) {
    history.replace('/bookshelf');
    return null;
  }
  history.replace('/login');
  return null;
}
