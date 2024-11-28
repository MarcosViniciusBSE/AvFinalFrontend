import axios from 'axios';

export default class RoleService {

    private http = axios.create({
        baseURL: 'http://localhost:8080/role',
        timeout: 1000,
        withCredentials: true,
    });

    public async getAllRoles(){
        return this.http.get("");
    }

}