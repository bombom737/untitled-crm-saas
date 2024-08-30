import axios from "axios";

export function apiPost(route: string, body:any) {
    return axios.post("http://localhost:3000" + route, body, { withCredentials: true })
}

export function apiFetch(route: string) {
    return axios.get("http://localhost:3000" + route, { withCredentials: true })
}

export async function isLoggedIn() {
    const response = await apiFetch("auth/is-logged-in")
    const loggedIn = response.data
    return loggedIn
}
