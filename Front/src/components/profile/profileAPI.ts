import axios from 'axios';
import { MY_SERVER } from '../../env';
import { ProfileModel } from '../../models/Profile';

export const getProfile = async (token: string) => {
  return await axios.get(MY_SERVER + 'profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}

export const getAllProfiles = async (token: string) => {
  return await axios.get(MY_SERVER + 'allprofiles', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}

export const updateProfile = async (token: string, profile: ProfileModel) => {
  return await axios.patch(MY_SERVER + 'allprofiles/' + profile.id, profile, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then((res) => res.data);
}

