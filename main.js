import { perform } from "./tasks";
import fs from 'fs';
import config from "./config"

function setupGoCDAuth(config) {
  if (config.gocd && config.gocd.auth) {
    const auth = config.gocd.auth;
    if (auth.username === "ENV_GOCD_USERNAME") {
      auth.username = process.env.GOCD_USERNAME;
    }

    if (auth.password === "ENV_GOCD_PASSWORD") {
      auth.password = process.env.GOCD_PASSWORD;
    }
  }
}
function setupCircleciToken(config) {
  const circleci = config.circleci;
  if (circleci && circleci.token) {
    if (circleci.token === "ENV_CIRCLECI_TOKEN") {
      circleci.token = process.env.CIRCLECI_TOKEN;
    }
  }
}
async function main() {
  setupGoCDAuth(config);
  setupCircleciToken(config);

  var pipelines = await perform(config);

  return new Promise((resolve, reject) => {
    fs.writeFile("./pipelines.json", JSON.stringify(pipelines, null, 2), (error) => {
      if(error) {
        return reject(error);
      }
      return resolve(pipelines)
    });
  })
}

setInterval(async () => {
  try {
    await main();
  } catch(e) {
    console.log("[ERROR]" + new Date())
  }
}, 30000);

