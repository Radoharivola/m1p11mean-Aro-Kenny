import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }


  getServices(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/service/services');
  }
}
