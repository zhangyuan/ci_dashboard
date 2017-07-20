import { getPipelines as getPipelinesFromGoCD } from "./gocd";
import { getPipeline as getPipelineFromCircleCI } from "./circleci";

export const perform = async (configuration) => {
  const gocd = configuration.gocd;
  const circleci = configuration.circleci;

  let pipelinesFromGoCD = []
  let pipelinesFromCircleCI = []
  if (gocd) {
    pipelinesFromGoCD = await getPipelinesFromGoCD(gocd.cctray, gocd.auth, ...gocd.projects);
  }

  if (circleci) {
    pipelinesFromCircleCI = await Promise.all(circleci.projects.map(async (project) => {
      return await getPipelineFromCircleCI(project.username, project.name, circleci.token);
    }));
  }

  const pipelines = pipelinesFromGoCD.concat(pipelinesFromCircleCI).sort((a, b) => a.name > b.name);

  return {
    pipelines: pipelines,
    timestamp: new Date().toISOString()
  }
};
