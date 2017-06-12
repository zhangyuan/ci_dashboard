# CI Dashboard

[![Build Status](https://travis-ci.org/zhangyuan/ci_dashboard.svg?branch=master)](https://travis-ci.org/zhangyuan/ci_dashboard)
[![Code Climate](https://codeclimate.com/github/zhangyuan/ci_dashboard.svg)](https://codeclimate.com/github/zhangyuan/ci_dashboard)

A Simple CI Dashboard. The following CI/CD services are supported:

* GoCD
* CircleCI

## Usage

The Dashboard is written in NodeJS with ES6 features. So NodeJS 7.x is required.

Install dependencies

```
npm install
```

Create configuration

```
cp config.json.example config.json
```

Update the file `config.json` with GoCD pipelines or CircleCI projects. 

GoCD's username and password can by passed from environment variables `GOCD_USERNAME` and `GOCD_PASSWORD`. 

CircleCI's token can be passed from environment variable of `CIRCLECI_TOKEN`.

Run the task to periodically fetch the status from remote service. The data is stored in `pipeline.json`.
 
Open another terminal and run the following command to run the web server,

```
npm run server
```

Then Open [http://localhost:3000](http://localhost:3000).

To use another port, for example `3000`, run
```
PORT=3333 npm run server
```

## Thanks

* jsfx https://github.com/loov/jsfx

