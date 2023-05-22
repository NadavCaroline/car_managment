import React, { useEffect } from 'react';
import axios from 'axios';
import { MY_SERVER, NotificationDaysExpiration } from './env';

const NextMainDate = () => {
    axios.post(MY_SERVER + 'nextmaindate', NotificationDaysExpiration);

}

export default NextMainDate;