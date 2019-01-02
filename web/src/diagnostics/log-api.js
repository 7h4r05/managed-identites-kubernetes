const axios = require('axios');
const env = require('../environment');

export class LogApi {
    get = () => {
        return axios.get(`${env.API_URL}/api/logs`);            
    }
}

export default LogApi;