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
        status: 'failed'
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
        { name: 'page', status: 'success' },
        {name: 'server', status: 'failed'}
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
        { name: 'api-performance-test', status: 'building' }
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
        { name: 'api-performance-test', status: 'building' }
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
        { name: 'api-performance-test', status: 'building' }
      ], pipelines);
    });

  });
});