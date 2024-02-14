import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login({ data }: { data: any; }): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://127.0.0.1:3000/auth/login', data, { headers, withCredentials: true });
  }

  register({ data }: { data: any; }): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://127.0.0.1:3000/auth/register', data, { headers, withCredentials: true });
  }

  test(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get('http://127.0.0.1:3000/protected', { headers, withCredentials: true });
  }

  getEmployees(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/users/employees');
  }

  
}
