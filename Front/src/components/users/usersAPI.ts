import axios from 'axios';
import { MY_SERVER } from '../../env';

export const getUsers = async (token: string) => {
  return await axios.get(MY_SERVER + 'allusers', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}
