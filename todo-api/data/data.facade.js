const axios = require('axios');

const axiosConfig = require('../axios.config');

class DataFacade{

    async getAll(){
        const items = await axios.get('http://tododata:4200');
        return items.data;
    }

    async create(item){
        const response = await axios.post('http://tododata:4200', item, axiosConfig);
        return response;
    }

    async remove(itemId){
        const response = await axios.delete('http://tododata:4200/' + itemId, axiosConfig);
        return response;
    }
}

module.exports = DataFacade; 