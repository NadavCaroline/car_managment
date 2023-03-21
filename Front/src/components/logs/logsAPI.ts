import axios from 'axios';

const LOGS_SERVER = 'http://127.0.0.1:8000/logs'
export const getLogs = async (token: string) => {
  return await axios.get(LOGS_SERVER, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}
