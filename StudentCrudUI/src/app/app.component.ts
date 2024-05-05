import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'StudentCrudUI';
  constructor(public router: Router) { }

  ngOnInit(): void {
  }
  
  // // Method to handle button click event
  // goToStudentForm(): void {
  //   this.router.navigateByUrl('studentForm'); // Navigate to the studentForm route
  // }

}
