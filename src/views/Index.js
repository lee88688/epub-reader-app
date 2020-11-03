import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useQuery } from '../hooks';

export default function Index() {
  const history = useHistory();
  const query = useQuery();
  const redirect = query.get('redirect');
  if (redirect) {
    history.replace(redirect);
    return;
  }
  const isLogin = Cookies.get('isLogin');
  if (isLogin) {
    history.replace('/bookshelf');
    return;
  }
  history.replace('/login');
}
