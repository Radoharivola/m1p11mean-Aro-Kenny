import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  getEmployees({searchString,sortBy,sortOrder}): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/users/employees?searchString='+searchString+'&sortBy='+sortBy+'&sortOrder='+sortOrder);
  }

  getEmployee(id: string): Observable<any> {
    return this.http.get('http://127.0.0.1:3000/users/employee/' + id);
  }

  newEmployee({ formData }: { formData: FormData; }): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/auth/register', formData);
  }

  updateEmployee({ formData, id }: { formData: FormData, id: string; }): Observable<any> {
    return this.http.put('http://127.0.0.1:3000/auth/users/'+id, formData);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete('http://127.0.0.1:3000/auth/users/'+id);
  }


}
