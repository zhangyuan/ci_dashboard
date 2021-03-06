import 'babel-polyfill';
var assert = require('assert');
import {perform} from "../tasks";
import nock from "nock";
import tk from "timekeeper";

nock.disableNetConnect();

describe('tasks', async() => {
  describe('given successful project', async() => {
    afterEach(() => {
      tk.reset();
    });

    it('should get pipeline status', async() => {
      nock('https://circleci.com')
        .get('/api/v1.1/project/github/ci/cicleciproject?circle-token=secret_token')
        .replyWithFile(200, __dirname + "/circleci/builds_success.json");

      nock('http://gocd.local')
        .get('/go/cctray.xml')
        .replyWithFile(200, __dirname + "/gocd/cctray.xml");

      var time = new Date(2017, 6, 1, 12, 0, 0);
      tk.freeze(time);

      const pipelines = await perform({
        "gocd": {
          "cctray": "http://gocd.local/go/cctray.xml",
          "projects": ["server"],
          "auth": {
            "username": "ci",
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

      assert.deepEqual({
        "pipelines": [
          {
            label: '3',
            name: "cicleciproject",
            status: "success",
            message: {
              "text": "[evzhang] update README.md"
            },
            "lastBuildTime": "2017-06-12T06:29:09.762Z"
          },
          {
            label: "7",
            name: "server",
            status: "failed",
            lastBuildTime: "2017-06-06T05:00:04-00:00",
            message: {
              text: "Yuan Zhang <evzhang@mail.local>",
              type: "breakers"
            }
        }],
        "timestamp": new Date(2017, 6, 1, 12, 0, 0).toISOString()
      }, pipelines);
    });
  });
});