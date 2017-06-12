const Koa = require('koa');
const path = require("path");
import sendfile from 'koa-sendfile';
import cors from "kcors"
import IO from 'koa-socket'
import watch from 'node-watch'
import fs from 'fs'
const _ = require('koa-route');
const serve = require('koa-static');

const app = new Koa();
const io = new IO();

io.attach( app );

app.use(cors());

const store_path = path.join(__dirname, "pipelines.json");

watch(store_path, () => {
  io.broadcast("hi");
});

app.use(_.get('/api/pipelines', async (ctx) => {
  ctx.response.type = 'json';

  if (fs.existsSync(store_path)) {
    ctx.body = fs.createReadStream(store_path);
  } else {
    ctx.body = []
  }
}));

app.use(_.get('/', async (ctx) => {
  const index_path = path.join(__dirname, "index.html");
  await sendfile(ctx, index_path)
}));

app.use(serve(__dirname + "/public"));

const port = process.env.PORT || 3000;
app.listen(port);
