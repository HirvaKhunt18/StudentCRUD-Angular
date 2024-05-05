import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GetDataService {
  baseUrl = 'https://localhost:7132/api/';
  constructor(private http: HttpClient) {}

  //Get States For Dropdown
  getStates(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'StudentAPI/GetStates');
  }

  //Get Cities For Dropdown
  getCities(stateId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}StudentAPI/GetCities/${stateId}`
    );
  }

  //Get Hobbies For Checkbox
  getHobbies(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'StudentAPI/GetHobbies');
  }

  //Get All Students Data
  getAllStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'StudentAPI/FetchAllStudents');
  }

   // Post Student Data
   AddUpdateStudent(studentData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'StudentAPI/AddUpdateStudent', studentData);
  }

  // Get Student Details for Edit
  getStudentDetails(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}StudentAPI/GetStudentDetails/${studentId}`);
  }

  //To Delete Student Data
  deleteStudent(studentId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}StudentAPI/Delete/${studentId}`);
  }
}
