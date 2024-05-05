import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetDataService } from '../_services/api-data.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { atLeastOneHobbySelectedValidator } from '../_shared/at-least-one-hobby-selected-validator';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
})
export class StudentFormComponent implements OnInit {
  isEditMode: boolean | undefined;
  stateDropDownData: any;
  hobbiesCheckboxesData: any[] = [];
  citiesDropdownData: any;
  buttonName: string | undefined;

  studentForm = new FormGroup({
    studentId: new FormControl<number>(0, [Validators.required]),
    firstName: new FormControl<string>('', [Validators.required]),
    lastName: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
    ]),
    stateId: new FormControl<string>('',[Validators.required]),
    cityId: new FormControl<string>('', [Validators.required]),
    phoneNumber: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
    ]),
    dob: new FormControl<Date | null>(null, [Validators.required]),
    address: new FormControl<string>('', [Validators.required]),
    gender: new FormControl<string>('', [Validators.required]),
    hobbies: this.formBuilder.array([],atLeastOneHobbySelectedValidator),
    hobbiesIds: new FormControl<string>(''),
    dateFormat: new FormControl<string>(''),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: GetDataService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.fetchStateDropdownData();
    this.fetchHobbiesData();
    const studentId = this.route.snapshot.params['id'];
    if (studentId) {
      this.isEditMode = true;
      this.buttonName = 'Update';
      this.fetchStudentDetails(studentId);
    } else {
      this.isEditMode = false;
      this.buttonName = 'Add';
    }
  }

  //Get detail of particular students
  fetchStudentDetails(studentId: number) {
    this.dataService.getStudentDetails(studentId).subscribe(
      (studentDetails) => {
        this.onEditModeCity(studentDetails.stateId);
        studentDetails.hobbies = studentDetails.hobbiesIds
          .split(',')
          .map(Number);
        this.onEditModeHobbies(studentDetails.hobbies);
        studentDetails.dob = this.datePipe.transform(
          studentDetails.dateOfBirth,
          'yyyy-MM-dd'
        );
        this.studentForm.patchValue(studentDetails);
        console.log(studentDetails);
      },
      (error) => {
        console.error('Error fetching student details:', error);
      }
    );
  }

  onCancel() {
    this.router.navigateByUrl('');
  }

  onSubmitForm() {
    if (this.validateData()) {
      const formData = {
        ...this.studentForm.value,
        stateId: parseInt(this.studentForm.value.stateId?.toString() ?? '0'),
        cityId: parseInt(this.studentForm.value.cityId?.toString() ?? '0'),
      };
      formData.hobbiesIds = this.hobbiesCheckboxesData
        .filter((hobby) => hobby.checked)
        .map((hobby) => hobby.hobbyId)
        .join(',');
      formData.phoneNumber = formData.phoneNumber?.toString();
      if (formData.dob) { 
        formData.dateFormat = this.datePipe.transform(
          formData.dob,
          'MM/dd/yyyy h:mm:ss a'
        );
      }
      console.log(formData.dob);
      console.log(formData);
      this.dataService.AddUpdateStudent(formData).subscribe(
        (response) => {
          if (formData.studentId && formData.studentId > 0) {
            this.toastr.success('Student updated successfully!');
          } else {
            this.toastr.success('Student added successfully!');
          }
          console.log('Student data added/updated successfully:', response);
          this.router.navigateByUrl('');
        },
        (error) => {
          console.error('Error adding/updating student data:', error);
        }
      );
    }
  }

  get f() {
    return this.studentForm.controls;
  }

  //submitting hobbies ids
  onHobbiesChange(e: any, hobbyId: number) {
    const hobby = this.hobbiesCheckboxesData.find(h => h.hobbyId === hobbyId);
    if (hobby) {
      hobby.checked = e.target.checked;
    }
    this.updateHobbiesValidation();
  }

  updateHobbiesValidation() {
    const selectedHobbies = this.hobbiesCheckboxesData.filter(h => h.checked);
    if (selectedHobbies.length > 0) {
      this.studentForm.get('hobbies')?.setErrors(null); 
    } else {
      this.studentForm.get('hobbies')?.setErrors({ 'atLeastOneHobbySelectedValidator': true }); 
    }
  }

  validateData(): boolean {
    this.studentForm.markAllAsTouched();  
    this.updateHobbiesValidation(); 
    return this.studentForm.valid;
  }

  //state data
  fetchStateDropdownData(): void {
    this.dataService.getStates().subscribe((data: any[]) => {
      this.stateDropDownData = data;
    });
  }

  //Edit mode city dropdown
  onEditModeCity(stateId: number) {
    this.dataService.getCities(stateId).subscribe((data: any[]) => {
      this.citiesDropdownData = data;
    });
  }

  //on Edit mode hobbies checked
  onEditModeHobbies(selectedHobbies: number[]) {
    if (!selectedHobbies) return;
    this.hobbiesCheckboxesData.forEach((hobby) => {
      hobby.checked = selectedHobbies.includes(hobby.hobbyId);
    });
  }

  //City Data
  onStateChange(event: any) {
    const stateId = event.target.value;
    this.dataService.getCities(stateId).subscribe((data: any[]) => {
      this.citiesDropdownData = data;
    });
  }

  //hobbies data
  fetchHobbiesData(): void {
     this.dataService.getHobbies().subscribe(
      (hobbies) => {
        this.hobbiesCheckboxesData = hobbies.map((hobby) => ({
          ...hobby,
          checked: false, 
        }));
      },
      (error) => {
        console.error('Error fetching hobbies:', error);
      }
    );
  }
}
