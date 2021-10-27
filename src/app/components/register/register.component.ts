import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { Role, UserModel } from 'src/app/models/user-models';
import { AuthService } from 'src/app/services/auth-service.service';
import { UserService } from 'src/app/services/user.service';
import { UserRoles } from 'src/app/utils/constants';
import { RoutingConstants } from 'src/app/utils/routes';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public min: Date = new Date(1900, 0, 1);
  public max: Date = new Date(2003, 0, 1);
  public roles = [UserRoles.Admin, UserRoles.Client];
  public shouldDisplayError: boolean = false;
  public errorList: string = "";
  public form: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
    address: new FormControl(),
    birthdate: new FormControl(),
    role: new FormControl()
  });

  constructor(
    private _router: Router, private _userService: UserService
  ) { }

  ngOnInit(): void {
  }

  @ViewChild("password") public textbox: TextBoxComponent;

  public ngAfterViewInit(): void {
    this.textbox.input.nativeElement.type = "password";
  }

  public toggleVisibility(): void {
    const inputEl = this.textbox.input.nativeElement;
    inputEl.type = inputEl.type === "password" ? "text" : "password";
  }

  public clearForm(): void {
    this.form.reset();
    this.shouldDisplayError = false;
  }

  public registerUser(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    let role = this.form.value.role === UserRoles.Admin ? Role.Admin : Role.Client

    let userToAdd = <UserModel>{
      userName: this.form.value.username,
      address: this.form.value.address,
      birthDate: this.form.value.birthdate,
      password: this.form.value.password,
      role: role
    }

    this._userService.registerUser(userToAdd).subscribe(_ => {
      this._router.navigate([RoutingConstants.USERS]);
    }, err => {
      this.errorList = "";
      if (err.error !== null) {
        err.error.forEach(element => {
          this.errorList += element.description;
          this.errorList += " ";
        });
        
      }
      this.shouldDisplayError = true;
    })

  }


  public onCancel(): void {
    this._router.navigate([RoutingConstants.USERS]);
  }

} 
 