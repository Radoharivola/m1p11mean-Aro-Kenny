import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RdvService {

  constructor(private http: HttpClient) { }

  newRdv({ data }: { data: any; }): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post('http://127.0.0.1:3000/rdv/new', data, { headers });
  }
  getRdv({ clientId, dateInit, dateFin, limit, page, dateSort }: { clientId: string, dateInit: string, dateFin: string, limit: number, page: number, dateSort: number }): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get('http://127.0.0.1:3000/rdv/' + clientId + '/' + dateInit + '/' + dateFin + '/' + limit + '/' + page + '/' + dateSort, { headers });
  }
}
