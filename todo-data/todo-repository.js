const az_storage = require('azure-storage');
const azClientFactory = require('./client.factory');
const entGen = az_storage.TableUtilities.entityGenerator;


class ToDoRepository{

    async getAll(){
        const client = await azClientFactory.create();
        return await client.queryEntities('todo', null, null)
                           .then(entities => {
                                 entities = entities.entries.map(entity => {
                                           return {
                                               createdAt: entity.createdAt ? entity.createdAt._ : null,
                                               isDone: entity.isDone._,
                                               note: entity.note._,
                                               id: entity.RowKey._
                                           };
                                       });
                                return entities;
                           });
    }

    async delete(id){
        const client = await azClientFactory.create();
        return await client.deleteEntity('todo', { PartitionKey: entGen.String('1'), RowKey: id})
                    .then(response => {
                        return true;
                    }).catch(e => {
                        return false;
                    });
    }

    async create(data){
        const client = await azClientFactory.create();
        const id = await this.findLastId(data, client);
        const entity = {
            PartitionKey: entGen.String('1'),
            RowKey: entGen.String(id.toString()),
            isDone: entGen.Boolean(data.isDone),
            note: entGen.String(data.note),
            createdAt: entGen.DateTime(new Date())
            };
        
        return await client.insertOrMergeEntity('todo', entity)
        .then((response) => {
            return {
                createdAt: entity.createdAt ? entity.createdAt._ : null,
                isDone: entity.isDone._,
                note: entity.note._,
                id: entity.RowKey._
            };
        }).catch(msg => {
            ctx.status = msg.statusCode;
            ctx.body = msg.message;
        });
    }

    async findLastId(item, client){
        let id = 0;
        if(typeof(item.id) === undefined || isNaN(parseInt(item.id))){
            const query = new az_storage.TableQuery();
            await client.queryEntities('todo', query, null)
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

module.exports = ToDoRepository