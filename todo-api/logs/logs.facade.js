const axios = require('axios');
const axiosCOnfig = require('../axios.config');

class LogsFacade{
    async getAll(){
        const response = await axios.get('http://todologs:4200/');
        return response.data;
    }

    async write(log){
        log = {
            track: log
        };
        const response = await axios.post('http://todologs:4200/', log, axiosCOnfig);
        return response;
    }
}

module.exports = LogsFacade;