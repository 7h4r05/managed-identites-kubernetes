const az_storage = require('azure-storage');
const util = require('util');
const axios = require('axios');

class azClientFactory{
    async create(){
        const response = await axios.get('http://todokeyvault:4200/logcs');
        const client = az_storage.createTableService(response.data);
        client.queryEntities = util.promisify(client.queryEntities);
        client.deleteEntity = util.promisify(client.deleteEntity);
        client.insertOrMergeEntity = util.promisify(client.insertOrMergeEntity);
        return client;
    }
}
module.exports = new azClientFactory();