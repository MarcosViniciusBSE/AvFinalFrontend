import axios from 'axios';
import User from "../model/User.ts";

export default class SessionService {

    private http = axios.create({
        baseURL: 'http://localhost:8080/user/',
        timeout: 1000,
        withCredentials: true,
    });

    public async login(user : User) {
        return this.http.post("autenticate", user)
    }

    public async getSession(){
        return this.http.get("/me");
    }

}