import 'babel-polyfill';
var assert = require('assert');
import { getPipelines } from "../../gocd";
import nock from "nock";

nock.disableNetConnect();

describe('GoCD', async () => {
  describe('getPipelines', async () =>  {
    it('should find single pipeline with last status', async () => {
      var scope = nock('http://gocd.local')
        .get('/go/cctray.xml')
        .replyWithFile(200, __dirname + "/cctray.xml");

      const pipelines = await getPipelines(
        'http://gocd.local/go/cctray.xml',
        {},
        "server"
      );
      assert.deepEqual([{
        name: 'server',
        status: 'failed',
        message: {
          "text": "Yuan Zhang <evzhang@mail.local>",
          "type": "breakers"
        },
        "label": "7"
      }], pipelines);
    });

    it('should find multiple pipelines with last status', async () => {
      var scope = nock('http://gocd.local')
        .get('/go/cctray.xml')
        .replyWithFile(200, __dirname + "/cctray.xml");

      const pipelines = await getPipelines(
        'http://gocd.local/go/cctray.xml',
        {},
        "server", "page"
      );
      assert.deepEqual([
        {
          "label": "32",
          name: 'page',
          status: 'success'
        },
        {
          "label": "7",
          name: 'server',
          status: 'failed',
          message: {
            text: "Yuan Zhang <evzhang@mail.local>",
            type: "breakers"
          }
        }
      ], pipelines);
    });

    it('should find failed pipeline with last status', async () => {
      var scope = nock('http://gocd.local')
        .get('/go/cctray.xml')
        .replyWithFile(200, __dirname + "/cctray_sleeping_with_last_build_status_Failure.xml");

      const pipelines = await getPipelines(
        'http://gocd.local/go/cctray.xml',
        {},
        'api-performance-test'
      );
      assert.deepEqual([
        {
          "label": "63",
          name: 'api-performance-test',
          status: 'failed', message: {
            "type" : "breakers",
            "text" : "Breaker Jack<pawans@mail.local>"
          }
        }
      ], pipelines);
    });

    it('should return pipeline with status of building', async () => {
      var scope = nock('http://gocd.local')
        .get('/go/cctray.xml')
        .replyWithFile(200, __dirname + "/cctray_building_with_last_build_status_Success.xml");

      const pipelines = await getPipelines(
        'http://gocd.local/go/cctray.xml',
        {},
        "api-performance-test"
      );
      assert.deepEqual([
        { "label": "63",
          name: 'api-performance-test', status: 'building' }
      ], pipelines);
    });

    it('should return pipeline with status of building and last build status of Failure', async () => {
      var scope = nock('http://gocd.local')
        .get('/go/cctray.xml')
        .replyWithFile(200, __dirname + "/cctray_building_with_last_build_status_Failure.xml");

      const pipelines = await getPipelines(
        'http://gocd.local/go/cctray.xml',
        {},
        "api-performance-test"
      );
      assert.deepEqual([
        { "label": "63", name: 'api-performance-test', status: 'building' }
      ], pipelines);
    });

    it('should return pipeline of multiple stages with status of building and last build status of Failure', async () => {
      var scope = nock('http://gocd.local')
        .get('/go/cctray.xml')
        .replyWithFile(200, __dirname + "/cctray_building_of_multiple_stages_with_last_build_status_Failure.xml");

      const pipelines = await getPipelines(
        'http://gocd.local/go/cctray.xml',
        {},
        "api-performance-test"
      );
      assert.deepEqual([
        { "label": "63", name: 'api-performance-test', status: 'building' }
      ], pipelines);
    });

  });
});