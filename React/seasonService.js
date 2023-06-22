import axios from "axios";
import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const seasonService = {
  endpoint: `${API_HOST_PREFIX}/api/seasons`,
};

seasonService.getSeason = () => {
  const config = {
    method: "GET",
    url: seasonService.endpoint,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

seasonService.getAll = () => {
  const config = {
    method: "GET",
    url: seasonService.endpoint,
    withCredentials: true,
    crossdomain: true,
    header: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

seasonService.getByConferenceId = (conferenceId) => {
  const config = {
    method: "GET",
    url: `${seasonService.endpoint}/conferences/${conferenceId}`,
    withCredentials: true,
    crossdomain: true,
    header: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

seasonService.add  = (payload) =>{
  const config = {
    method: "POST",
    url: seasonService.endpoint,
    withCredentials: true,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}
seasonService.delete = (id) => {
  const config = {
    method: "DELETE",
    url: `${seasonService.endpoint}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(() => {
    return id;
  });
};
seasonService.update = (payload,id) =>{
  const config = {
    method: "PUT",
    url: `${seasonService.endpoint}/${id}`,
    withCredentials: true,
    data: payload,
    crossdomain: true,
    header: { "Content-Type": "application/json" },
  };
  return axios(config);
}
seasonService.statusUpdate = (id, statusId) =>{
  const config = {
    method: "PUT",
    url: `${seasonService.endpoint}/status/${id}/${statusId}`,
    withCredentials: true,
    crossdomain: true,
    header: { "Content-Type": "application/json" },
  };
  return axios(config);
}
seasonService.GetByConferencePaginate = (pageIndex,pageSize,conferenceId) => {
  const config = {
    method: "GET",
    url: `${seasonService.endpoint}/conference/${conferenceId}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    header: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);}



seasonService.getSeasonById = (seasonId) => {
  const config = {
    method: "GET",
    url: `${seasonService.endpoint}/${seasonId}`,
    withCredentials: true,
    crossdomain: true,
    header: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export default seasonService;
