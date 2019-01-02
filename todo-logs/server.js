
const koa = require('koa');
const koaRouter = require('koa-router');
const LogsRepository = require('./logs-repository');
const app = new koa();
const koaBodyParser = require('koa-bodyparser');
const router = new koaRouter();

const logsRepository = new LogsRepository();

router.get('/', async (ctx,next) => {
    await next();
    const items = await logsRepository.getAll();
    ctx.body = items;

});

router.post('/', async (ctx, next) => {
    await next();
    const data = ctx.request.body;
    await logsRepository.create(data);
    ctx.body = 200;
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
    .use(koaBodyParser())
    .use(router.routes())
    .use(router.allowedMethods());
  

app.listen(4200);
