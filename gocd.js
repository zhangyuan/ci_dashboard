import axios from 'axios'
var parseString = require('xml2js').parseString;

const getCCTray = async(endpoint, auth) => {
    return await axios.get(endpoint, {auth: auth});
};

export const getPipelines = async (endpoint, auth, ...names) => {
    const res = await getCCTray(endpoint, auth);
    return new Promise((resolve, reject) => {
        parseString(res.data, (err, result) => {
            const projects = result.Projects.Project.map((x) => {
                const $ = x.$;
                return {
                    name: $.name,
                    pipelineName: $.name.split(" :: ")[0],
                    stageName: $.name.split(" :: ")[1] || null,
                    jobName: $.name.split(" :: ")[2] || null,
                    lastBuildTime: $.lastBuildTime,
                    lastBuildLabel: $.lastBuildLabel,
                    lastBuildStatus: $.lastBuildStatus,
                    activity: $.activity
                }
            });

            const targetProjects = projects;

            const pipelineNames = [...new Set(projects.map(x => x.pipelineName))];

            const failedProjects = targetProjects.filter(x => x.lastBuildStatus === "Failure");
            const failedPipelineNames = [ ...new Set(failedProjects.map(x => x.pipelineName)) ];

            const successfulPipelineNames = [... new Set([... pipelineNames].filter(x => failedPipelineNames.indexOf(x) === -1))];

            const pipelines = successfulPipelineNames.map(name => {
                return {
                    name: name,
                    status: "success"
                }
            }).concat(failedPipelineNames.map(name => {
                return {
                    name: name,
                    status: "failed"
                }
            })).sort((a, b) => a > b);

            const selectedPipelines = pipelines.filter(x => names.indexOf(x.name) >= 0);
            resolve(selectedPipelines);
        });
    })

};