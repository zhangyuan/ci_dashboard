const Koa = require('koa');
const path = require("path")
import sendfile from 'koa-sendfile';
import cors from "kcors"
const _ = require('koa-route');

const app = new Koa();
app.use(cors());

app.use(_.get('/api/pipelines', async (ctx) => {
  const store_path = path.join(__dirname, "pipelines.json");
  var stats = await sendfile(ctx, store_path);

  if(!stats) {
    ctx.body = [];
  }
}));

app.use(_.get('/', async (ctx) => {
  const index_path = path.join(__dirname, "index.html");
  await sendfile(ctx, index_path)
}));

app.listen(3000);