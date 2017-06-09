const Koa = require('koa');
const path = require("path");
import sendfile from 'koa-sendfile';
import cors from "kcors"
import IO from 'koa-socket'
import watch from 'node-watch'
const _ = require('koa-route');
import fs from "fs";
import jsondiffpatch from "jsondiffpatch";

const store_path = path.join(__dirname, "pipelines.json");

function load_pipelines() {
  const text = fs.readFileSync(store_path, {encoding: "utf-8"});
  return JSON.parse(text);
}

let store = load_pipelines();

const app = new Koa();
const io = new IO();

io.attach( app );

app.use(cors());

watch(store_path, () => {
  var pipelines = load_pipelines();

  if(jsondiffpatch.diff(store, pipelines)) {
    store = pipelines;
    io.broadcast("hi");
  }
});

app.use(_.get('/api/pipelines', async (ctx) => {
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