import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentFormComponent } from './student-form/student-form.component';
import { StudentListTableComponent } from './student-list-table/student-list-table.component';

const routes: Routes = [  
  {path:'',redirectTo:'', pathMatch:'full'},
  {path:'studentForm', component: StudentFormComponent},
  { path: 'studentForm/:id', component: StudentFormComponent },
  {path:'studentListData',component:StudentListTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
