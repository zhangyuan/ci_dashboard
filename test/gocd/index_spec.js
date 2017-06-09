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

  });
});