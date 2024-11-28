import axios from 'axios';
import {Book} from "../model/Book.ts";

export default class BookService {

    private http = axios.create({
        baseURL: 'http://localhost:8080/book',
        timeout: 1000
    });

    public async getAll()  {
        return this.http.get("")
    }

    public async saveBook(book : Book)
    {
        console.log(book)
        return this.http.post("", book)
    }

    public async updateBook(book : Book){
        return this.http.put("", book)
    }

    public async getById(id: string){
        return this.http.get(`/${id}`)
    }
    public async delete(id: string){
        return this.http.delete(`/${id}`)
    }
    public async rent(book : Book){
        return this.http.put(`/rent`, book)
    }
    public async returnBook(book : Book){
        return this.http.put(`/return`, book)
    }


}