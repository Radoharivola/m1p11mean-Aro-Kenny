import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Add other headers if needed
  });
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
    observe: 'response' as 'response'
  };
  constructor(private http: HttpClient) { }


  getEmployees(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/users/employees?sortBy=name&sortOrder=-1', this.httpOptions);
  }

  newUser({ formData }: { formData: FormData; }): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/auth/register', formData);
  }

  login({ data }: { data: any; }): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

      withCredentials: true,
      observe: 'response' as 'response'
    };
    return this.http.post('http://127.0.0.1:3000/auth/login', data, httpOptions);
  }

  test(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

      withCredentials: true,
      observe: 'response' as 'response'
    };
    return this.http.get('http://127.0.0.1:3000/protected', httpOptions);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('uToken');
    if (!token) return false;

    return true;
  }

  logout(): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/auth/logout', null, this.httpOptions);
  }

}
