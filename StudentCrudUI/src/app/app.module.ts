import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { StudentFormComponent } from './student-form/student-form.component';

import { HttpClientModule } from '@angular/common/http'; 
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe, registerLocaleData } from '@angular/common';
import { StudentListTableComponent } from './student-list-table/student-list-table.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DfxTableModule, DfxSortModule, DfxPaginationModule } from 'dfx-bootstrap-table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StudentFormComponent,
    StudentListTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-left'
    }),
    BrowserAnimationsModule,
    // MatPaginatorModule,
    // MatTableModule,
    // MatSortModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatIconModule
    DfxTableModule,
    DfxSortModule,
    DfxPaginationModule,
    NgbModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
