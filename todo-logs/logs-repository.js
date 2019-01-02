const az_storage = require('azure-storage');
const entGen = az_storage.TableUtilities.entityGenerator;
const util = require('util');
const azClientFactory = require('./client.factory');

class LogsRepository{

    async getAll(){
        const client = await azClientFactory.create();
        return await client.queryEntities('logs', null, null)
                    .then(entities => {
                        entities = entities.entries.map(entity => {
                                    return {
                                        id: entity.RowKey._,
                                        log: entity.log ? entity.log._ : null,
                                        createdAt: entity.Timestamp ? entity.Timestamp._ : null
                                    };
                                });
                        entities.sort((a,b) => {
                                    return parseInt(a.id) < parseInt(b.id) ? 1 : -1;
                                });
                        return entities;
                    });
    }

    async create(data){
        const client = await azClientFactory.create();
        const id = await this.findLastId(data, client);
        const entity = {
            PartitionKey: entGen.String('1'),
            RowKey: entGen.String(id.toString()),
            log: entGen.String(JSON.stringify(data))
            };
        
        return await client.insertOrMergeEntity('logs', entity);
    }

    async findLastId(item, client){
        let id = 0;
        if(typeof(item.id) === undefined || isNaN(parseInt(item.id))){
            const query = new az_storage.TableQuery();
            await client.queryEntities('logs', query, null)
            .then(response => {
                try{
                    const entries = response.entries.filter(e => !isNaN(parseInt(e.RowKey._))).map(e => parseInt(e.RowKey._));
                    if(entries.length === 0){
                        entries.push(0);
                    }
                    id = Math.max(...entries) + 1;
                }catch(e){
                    id = 1;
                }
                if(isNaN(id)){
                    id = 1;
                }

            });
        }else{
            id = parseInt(item.id);
        }
        return id;
    }
}

module.exports = LogsRepository