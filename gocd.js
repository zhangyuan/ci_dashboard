import axios from 'axios'
import lodash from 'lodash'
const parseString = require('xml2js').parseString;

const getCCTray = async(endpoint, auth) => {
    return await axios.get(endpoint, {auth: auth});
};

export const getPipelines = async (endpoint, auth, ...names) => {
    const res = await getCCTray(endpoint, auth);
    return new Promise((resolve, reject) => {
        parseString(res.data, (err, result) => {
            const projects = result.Projects.Project.map((x) => {
                const $ = x.$;
                const messages = x.messages;
                const message = (messages && messages.length > 0) ? messages[0].message[0].$ : null;

                return {
                    name: $.name,
                    pipelineName: $.name.split(" :: ")[0],
                    stageName: $.name.split(" :: ")[1] || null,
                    jobName: $.name.split(" :: ")[2] || null,
                    lastBuildTime: $.lastBuildTime,
                    lastBuildLabel: $.lastBuildLabel.split(" :: ")[0],
                    lastBuildStatus: $.lastBuildStatus,
                    activity: $.activity,
                    message: message
                }
            });

            const targetProjects = projects.filter(x => {
                return x.stageName !== null && x.jobName === null
            });

            const buildingProjects = targetProjects.filter(x => x.activity === "Building");
            const buildingPipelineNames = [ ...new Set(buildingProjects.map(x => x.pipelineName)) ];

            const failedProjects = lodash(targetProjects).filter(x => {
                return buildingPipelineNames.indexOf(x.pipelineName) === -1 && x.activity === "Sleeping" && x.lastBuildStatus === "Failure";
            }).uniqBy(x => x.pipelineName)
              .value();

            const failedPipelineNames = [ ...new Set(failedProjects.map(x => x.pipelineName)) ];

            const successfulPipelines = lodash(targetProjects).filter(x => {
                  return failedPipelineNames.indexOf(x.pipelineName) === -1 && buildingPipelineNames.indexOf(x.pipelineName) === -1;
              }).uniqBy(x => x.pipelineName)
              .value();

            const pipelines = successfulPipelines.map(x => {
                return {
                    name: x.pipelineName,
                    status: "success",
                    lastBuildTime: x.lastBuildTime,
                    label: x.lastBuildLabel
                }
            }).concat(failedProjects.map(x => {
                let message = null;
                if(x.message && x.message.kind === "Breakers") {
                    message = {
                        "type" : "breakers",
                        "text" : x.message.text
                    }
                }
                return {
                    name: x.pipelineName,
                    status: "failed",
                    message: message,
                    label: x.lastBuildLabel,
                    lastBuildTime: x.lastBuildTime
                }
            }).concat(buildingProjects.map(x => {
                return {
                    name: x.pipelineName,
                    status: "building",
                    lastBuildTime: x.lastBuildTime,
                    label: x.lastBuildLabel
                }
              }))
            ).sort((a, b) => a > b);

            const selectedPipelines = pipelines.filter(x => names.indexOf(x.name) >= 0);
            resolve(selectedPipelines);
        });
    })

};