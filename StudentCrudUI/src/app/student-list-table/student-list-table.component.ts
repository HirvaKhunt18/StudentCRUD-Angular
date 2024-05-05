import { Component, OnInit,ViewChild ,AfterViewInit } from '@angular/core';
import { GetDataService } from '../_services/api-data.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { NgbPaginator, NgbSort, NgbTableDataSource } from 'dfx-bootstrap-table';
import { FormControl } from '@angular/forms';


@Component({    
  selector: 'app-student-list-table',
  templateUrl: './student-list-table.component.html',
  styleUrls: ['./student-list-table.component.css'],
})
export class StudentListTableComponent implements OnInit,AfterViewInit  {
 page = 1; // Initialize the current page to 1
 pageSize = 5;
  pageSizes = [5,10,20,40]; // Specify the number of items per page
  totalItems = 0; // Initialize the total number of items to 0
  pageSizeOptions!:[5,10,15,20,50,100];
  allStudentsData: any;
  filter = new FormControl();
  columnsToDisplay: string[] = ['studentId', 'firstName', 'lastName', 'gender', 'stateName', 'cityName', 'hobbyName', 'email', 'phoneNumber', 'dateOfBirth', 'actions'];
  dataSource!: NgbTableDataSource<any>;

  @ViewChild(NgbSort) sort!: NgbSort;
  @ViewChild(NgbPaginator) paginator!: NgbPaginator;

  constructor(
    private dataService: GetDataService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
  this.fetchAllStudentData();
    this.dataSource = new NgbTableDataSource(this.allStudentsData);
    this.filter.valueChanges.subscribe((value) => {
      this.dataSource.filter = value;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  // Method to handle button click event
  goToStudentForm(): void {
    this.router.navigateByUrl('studentForm'); 
  }
  editStudent(studentId: number) {
    this.router.navigate(['/studentForm', studentId]);
  }

  onClearSearchInput(){
    this.filter.setValue('');
  }

  deleteStudent(studentId: number) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this student?'
    );
    if (confirmation) {
      this.dataService.deleteStudent(studentId).subscribe(
        (response) => {
          this.toastr.error('Student deleted successfully');
          console.log('Student deleted successfully:', response);
          this.fetchAllStudentData();
        },
        (error) => {
          console.error('Error deleting student:', error);
        }
      );
    }
  }


  fetchAllStudentData(): void {
    this.dataService.getAllStudents().subscribe((data: any[]) => {
      this.dataSource = new NgbTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.totalItems = data.length;
    });
  }
}