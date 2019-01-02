const koa = require('koa');
const koaRouter = require('koa-router');
const koaBodyParser = require('koa-bodyparser');
const koaRequest = require('koa-http-request');
const dataFacadeDefintion = require('./data/data.facade');
const logsFacadeDefinition = require('./logs/logs.facade');

const app = new koa();
const router = new koaRouter();
const dataFacade = new dataFacadeDefintion();
const logsFacade = new logsFacadeDefinition();

router.get('/api/items', async (ctx, next) => {
    const items = await dataFacade.getAll();
    ctx.body = items;
    await next();
});

router.post('/api/items', async (ctx, next) => {
    const upload = ctx.request.body;
    const created = await dataFacade.create(upload);
    ctx.body = created.data;
    if(created.status === 200){
        if( upload.id && !isNaN(parseInt(upload.id))){
            logsFacade.write(`Edited item: ${upload.id}`);
        }else{
            logsFacade.write(`Created new item: ${created.data.id}`)
        }
    }
    await next();
});

router.delete('/api/items/:id', async (ctx, next) => {
    const id = ctx.params.id;
    const created = await dataFacade.remove(id);
    ctx.body = created.data;
    logsFacade.write(`Removed item: ${id}`);
    await next();
});

router.get('/api/logs', async (ctx, next) => {
    const logs = await logsFacade.getAll();
    ctx.body = logs;
    await next();
});


app.use(async (ctx, next) => {
        let origin = ctx.req.headers.origin;
        if(!origin){
            origin = ctx.req.headers["access-control-allow-origin"]
        }
        if(origin){
            ctx.set('Access-Control-Allow-Origin', origin);
        }else{
            ctx.set('Access-Control-Allow-Origin','http://localhost')
        }
        ctx.set('Access-Control-Allow-Methods','GET,DELETE,POST');
        ctx.set('Access-Control-Allow-Headers','Content-Type');
        await next();
    })
    .use(koaRequest({
        json: true,
        timeout: 3000
    }))
    .use(koaBodyParser())
    .use(router.routes())
    .use(router.allowedMethods());
  

const server = app.listen(3001);
