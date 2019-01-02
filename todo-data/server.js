const koa = require('koa');
const koaRouter = require('koa-router');
const ToDoRepository = require('./todo-repository');
const koaBodyParser = require('koa-bodyparser');
const koaRequest = require('koa-http-request');

const app = new koa();
const router = new koaRouter();
const repository = new ToDoRepository();


router.get('/', async (ctx, next) => {
    await next();
    const items = await repository.getAll();
    ctx.body = items;
});

router.post('/', async (ctx, next) => {
    await next();
    const data = ctx.request.body;
    ctx.status = 200;
    const response = await repository.create(data).catch(err => {
        ctx.status = 400;
    });
    ctx.body = response;
});

router.delete('/:id', async (ctx, next) => {
    await next();
    const id = ctx.params.id;
    ctx.status = 200;
    await repository.delete(id).catch(err => {
        ctx.status = 400;
    });
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
  

app.listen(4200);
