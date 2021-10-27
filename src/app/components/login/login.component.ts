import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public invalidLogin: boolean = false;

  constructor(
    private _router: Router, private _authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  @ViewChild("password") public textbox: TextBoxComponent;

  public ngAfterViewInit(): void {
    this.textbox.input.nativeElement.type = "password";
  }

  public form: FormGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  });

  public login(): void {
     this.invalidLogin = false;
    this.form.markAllAsTouched();
    if(this.form.invalid) {
      this.invalidLogin = true;
    }
    const credentials = {
      userName: this.form.value.username,
      password: this.form.value.password
    };
    this._authService.login(credentials).subscribe(response => {
      const token = (<any>response).token;
      localStorage.setItem("jwt", token);
      localStorage.setItem("userName", this.form.value.username);
      this.invalidLogin = false;
      if(this._authService.isUserAdmin()) {
        this._router.navigate(["/users"]);
      } else {
        this._router.navigate(["/devices"])
      }
    }, _ => {
      this.invalidLogin = true;
    });
  }

  public clearForm(): void {
    this.form.reset();
    this.invalidLogin = false;
  }

}
