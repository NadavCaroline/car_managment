import axios from 'axios';

const PROFILE_SERVER = 'http://127.0.0.1:8000/profile'
export const getProfile = async (token: string) => {
  return await axios.get(PROFILE_SERVER, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}
