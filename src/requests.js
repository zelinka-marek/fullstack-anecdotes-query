import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

export function getAnecdotes() {
  return axios.get(baseUrl).then((response) => response.data);
}

export function createAnecdote(data) {
  return axios.post(baseUrl, data).then((response) => response.data);
}

export function updateAnecdote(data) {
  return axios
    .put(`${baseUrl}/${data.id}`, data)
    .then((response) => response.data);
}
