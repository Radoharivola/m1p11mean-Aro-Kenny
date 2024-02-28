import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

    withCredentials: true,
    observe: 'response' as 'response'
  };
  constructor(private http: HttpClient) { }
  getPrefServices(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/preference/my-pref-services', this.httpOptions);
  }
  getPrefEmps(): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/preference/my-pref-emps', this.httpOptions);
  }
  updatePrefService(service: any): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/preference/update-pref-service',service,this.httpOptions);
  }
  updatePrefEmp(emp: any): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/preference/update-pref-emp',emp,this.httpOptions);
  }
}
