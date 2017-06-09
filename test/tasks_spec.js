import 'babel-polyfill';
var assert = require('assert');
import { perform } from "../tasks";
import nock from "nock";

nock.disableNetConnect();

describe('tasks', async () => {
  describe('given successful project', async () =>  {
    it('should get pipeline status', async () => {
      nock('https://circleci.com')
        .get('/api/v1.1/project/github/ci/cicleciproject?circle-token=secret_token')
        .replyWithFile(200, __dirname + "/circleci/builds_success.json");

      nock('http://gocd.local')
        .get('/go/cctray.xml')
        .replyWithFile(200, __dirname + "/gocd/cctray.xml");

      const pipelines = await perform({
        "gocd" : {
          "cctray" : "http://gocd.local/go/cctray.xml",
          "projects" : ["server"],
          "auth" : {
            "username" : "ci",
            "password": "secret_password"
          }
        },
        "circleci": {
          "projects": [{
            "username": "ci",
            "name": "cicleciproject",
          }],
          "token": "secret_token"
        }
      });

      assert.deepEqual([{
        name: "cicleciproject",
        status: "success"
      },{
        name: "server",
        status: "failed",
      }], pipelines);
    });
  });
});