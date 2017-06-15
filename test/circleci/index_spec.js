import 'babel-polyfill';
var assert = require('assert');
import { getPipeline } from "../../circleci";
import nock from "nock";

nock.disableNetConnect();

describe('CircleCI', async () => {
  describe('given failed project', async () =>  {
    it('should get pipeline status', async () => {
      var scope = nock('https://circleci.com')
        .get('/api/v1.1/project/github/theusername/theproject?circle-token=secret_token')
        .replyWithFile(200, __dirname + "/builds_failed.json");

      const pipeline = await getPipeline('theusername', 'theproject', "secret_token");
      assert.deepEqual({
        name: "theproject",
        status: "failed",
        "lastBuildTime": "2017-06-12T06:29:09.762Z",
        label: "1",
        message: {text: "[evzhang] do something stupid"},
      }, pipeline);
    });
  });

  describe('given fixed project', async () =>  {
    it('should get pipeline status', async () => {
      var scope = nock('https://circleci.com')
        .get('/api/v1.1/project/github/theusername/theproject?circle-token=secret_token')
        .replyWithFile(200, __dirname + "/builds_fixed.json");

      const pipeline = await getPipeline('theusername', 'theproject', "secret_token");
      assert.deepEqual({
        message: {
          "text": "[evzhang] update README.md"
        },
        "lastBuildTime": "2017-06-12T06:29:09.762Z",
        name: "theproject",
        status: "success",
        label: '2'
      }, pipeline);
    });
  });

  describe('given successful project', async () =>  {
    it('should get pipeline status', async () => {
      var scope = nock('https://circleci.com')
        .get('/api/v1.1/project/github/theusername/theproject?circle-token=secret_token')
        .replyWithFile(200, __dirname + "/builds_success.json");

      const pipeline = await getPipeline('theusername', 'theproject', "secret_token");
      assert.deepEqual({
        message: {
          "text": "[evzhang] update README.md"
        },
        "lastBuildTime": "2017-06-12T06:29:09.762Z",
        name: "theproject",
        status: "success",
        label: '3'
      }, pipeline);
    });
  });

  describe('given running project', async () =>  {
    it('should get pipeline status', async () => {
      var scope = nock('https://circleci.com')
        .get('/api/v1.1/project/github/theusername/theproject?circle-token=secret_token')
        .replyWithFile(200, __dirname + "/builds_running.json");

      const pipeline = await getPipeline('theusername', 'theproject', "secret_token");
      assert.deepEqual({
        message: {
          "text": "[evzhang] update README.md"
        },
        "lastBuildTime": "2017-06-12T06:29:09.762Z",
        name: "theproject",
        status: "building",
        label: '2'
      }, pipeline);
    });
  });

});