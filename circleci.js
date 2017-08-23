import axios from 'axios'

const getProjectBuilds = async(username, project, token) => {
    const endpoint = `https://circleci.com/api/v1.1/project/github/${username}/${project}?circle-token=${token}`
    return await axios.get(endpoint);
};

export const getPipeline = async (username, project, token) => {
    const res = await getProjectBuilds(username, project, token);

    let status;

    const build = res.data[0];

    let lastBuildTime = build.stop_time;;

    if(build.workflows) {
        status = "success"
        const workflowId = build.workflows.workflow_id
        const builds = res.data.filter(x => x.workflows && x.workflows.workflow_id === workflowId)
        if(builds.filter(x => x.status === "failed").length > 0) {
            status = "failed"
        }
    } else {
        switch(build.status){
            case "fixed":
                status = "success";
                break;
            case "failed":
                status = "failed";
                break;
            case "running":
                status = "building";
                lastBuildTime = build.start_time;
                break;
            default:
                status = "success";
        }
    }



    const message = {
        text: `[${build.committer_name}] ${build.subject}`
    };
    return {
        name: project,
        status: status,
        label: `${build.build_num}`,
        message: message,
        lastBuildTime: lastBuildTime
    }
};