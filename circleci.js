import axios from 'axios'

const getProjectBuilds = async(username, project, token) => {
    const endpoint = `https://circleci.com/api/v1.1/project/github/${username}/${project}?circle-token=${token}`
    return await axios.get(endpoint);
};

export const getPipeline = async (username, project, token) => {
    const res = await getProjectBuilds(username, project, token);

    let status;

    const build = res.data[0];

    let lastBuildTime = build.stop_time;

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