import axios from 'axios';
import User from "../model/User.ts";

export default class UserService {

    private http = axios.create({
        baseURL: 'http://localhost:8080/user',
        timeout: 1000,
        withCredentials: true,
    });

    public async createUser(user : User) {
        return this.http.post("", user)
    }

    public async getAllUsers(){
        return this.http.get("");
    }

    public async updateUser(user :User){
        return this.http.put("", user)
    }

    public async deleteUser(id : string){
        return this.http.delete(`/${id}`)
    }

}