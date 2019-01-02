const axios = require('axios');
const env = require('../environment');
const axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
    }
  };
export class TodoApi {
    getItems = () => {
        return axios.get(`${env.API_URL}/api/items`);            
    }

    postItem = (todo) => {
        return axios.post(`${env.API_URL}/api/items`, todo, axiosConfig);
    }

    deleteItem = (todo) => {
        return axios.delete(`${env.API_URL}/api/items/${todo}`, axiosConfig);
    }

    getLogs = () => {

    }
}

export default TodoApi;