import axios from "axios";

const url = "https://60cf56d54a030f0017f67973.mockapi.io";

export const fetchData = () => axios.get(`${url}/project4`);

export const addData = (data) => axios.post(`${url}/project4`, data);

export const updateData = (data) =>
  axios.put(`${url}/project4/` + data.id, data);

export const deleteData = (id) => axios.delete(`${url}/project4/` + id);
