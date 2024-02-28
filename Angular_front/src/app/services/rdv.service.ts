import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RdvService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
    observe: 'response' as 'response'
  };
  constructor(private http: HttpClient) { }
  newRdv({ data }: { data: any; }): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/rdv/new', data, this.httpOptions);
  }
  getRdv({ dateInit, dateFin, limit, page, dateSort }: { dateInit: string, dateFin: string, limit: number, page: number, dateSort: number }): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/rdv/' + dateInit + '/' + dateFin + '/' + limit + '/' + page + '/' + dateSort, this.httpOptions);
  }

  get({ id }: { id: string }): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/rdv/' + id, this.httpOptions);
  }

  delete(id: string): Observable<any> {
    return this.http.delete('http://127.0.0.1:3000/rdv/rdvs/' + id, this.httpOptions);
  }
}
