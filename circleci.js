import axios from 'axios'

const getProjectBuilds = async(username, project, token) => {
    const endpoint = `https://circleci.com/api/v1.1/project/github/${username}/${project}?circle-token=${token}`
    return await axios.get(endpoint);
};

export const getPipeline = async (username, project, token) => {
    const res = await getProjectBuilds(username, project, token);

    let status;

    switch(res.data[0].status){
        case "fixed":
            status = "success";
            break;
        case "failed":
            status = "failed";
            break;
        default:
            status = "success";
    }
    return {
        name: project,
        status: status
    }
};