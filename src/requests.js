import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

export function getAnecdotes() {
  return axios.get(baseUrl).then((response) => response.data);
}
