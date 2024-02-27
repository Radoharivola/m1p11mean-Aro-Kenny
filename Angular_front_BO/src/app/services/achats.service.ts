import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AchatsService {

  constructor(private http: HttpClient) { }

  getAchats(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/depense/achats');
  }

  newAchats({ data }: { data: any; }): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/depense/new', data);
  }

  deleteAchats(id: string): Observable<any> {
    return this.http.delete('http://127.0.0.1:3000/depense/delete/'+id);
  }

}
