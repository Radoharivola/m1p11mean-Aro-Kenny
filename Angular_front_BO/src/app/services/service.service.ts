import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  getServices(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/service/services');
  }

  newService({ data }: { data: any; }): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/service/new', data);
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete('http://127.0.0.1:3000/service/delete/'+id);
  }

  updateService({ data, id }: { data: any, id: string; }): Observable<any> {
    return this.http.put('http://127.0.0.1:3000/service/update/'+id, data);
  }

  getService(id: string): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/service/service/' + id);
  }
}
