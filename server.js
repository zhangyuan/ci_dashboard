const Koa = require('koa');
const path = require("path")
import sendfile from 'koa-sendfile';
import cors from "kcors"

const app = new Koa();
app.use(cors());

app.use(async (ctx) => {
  const store_path = path.join(__dirname, "pipelines.json");
  var stats = await sendfile(ctx, store_path);

  if(!stats) {
    ctx.body = [];
  }
});


app.listen(3000);