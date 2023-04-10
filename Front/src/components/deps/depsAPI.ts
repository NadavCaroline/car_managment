import axios from 'axios';

const DEPS_SERVER = 'http://127.0.0.1:8000/departments'


export const getDeps = async (token: string) => {
  return await axios.get(DEPS_SERVER, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}
