const koa = require('koa');
const koaRouter = require('koa-router');
const KeyVaultClient = require('./client.factory');
const koaBodyParser = require('koa-bodyparser');
const koaRequest = require('koa-http-request');

const app = new koa();
const router = new koaRouter();
const keyVaultClient = new KeyVaultClient();


router.get('/:key', async (ctx, next) => {
    await next();
    const result = await keyVaultClient.getSecret(ctx.params.key);
    ctx.body = result.value;
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
