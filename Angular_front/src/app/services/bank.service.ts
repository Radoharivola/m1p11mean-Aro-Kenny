import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
    observe: 'response' as 'response'
  };
  constructor(private http: HttpClient) { }
  refill(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/bank/refill', data, this.httpOptions);
  }
  get(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/bank/', this.httpOptions);

  }
}
