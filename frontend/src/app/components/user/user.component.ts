import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../validators/must-match.validator';
import { globalModules, materialModules } from '../../gobalModules';
import { AlertComponent } from '../alert/alert.component';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user',
  imports: [MatDialogModule, ...globalModules, ...materialModules],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  readonly dialogRef = inject(MatDialogRef<UserComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  authService = inject(AuthService);
  userService = inject(UserService);
  dialog = inject(MatDialog);
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm() {
    this.userForm = this.fb.group(
      {
        first_name: [this.data.first_name || '', Validators.required],
        last_name: [this.data.last_name || '', Validators.required],
        password: [
          this.data.id ? '********' : '',
          [Validators.required, Validators.minLength(6)],
        ],
        confirmPassword: [this.data.id ? '********' : '', Validators.required],
        email: [this.data.email || '', [Validators.required, Validators.email]],
        phone: [this.data.phone || '', Validators.required],
        gender: [this.data.gender || '', Validators.required],
        address: [this.data.address || '', Validators.required],
        role: [{
          value: this.data.role || '',
          disabled: true
        }, Validators.required],
      },
      {
        validator: this.data.id
          ? undefined
          : MustMatch('password', 'confirmPassword'),
      }
    );
  }

  ngAfterViewInit(){
    if(this.data.readonly) {
      this.userForm.disable();
    } else {
      if(this.data.id != this.authService.userId) {
        this.userForm.get("role")?.enable();
      }
  
      if(this.data.id){
        this.userForm.get("password")?.disable();
        this.userForm.get("confirmPassword")?.disable();
      }
    }
  }

  deleteUser() {
    this.userService.deleteUser(this.data).then(res => {
      if(res) this.dialogRef.close(true);
    });
  }

  onSubmit(){
    if(!this.data?.id) this.createUser();
    else this.updateUser();
  }

  createUser() {
    const value = this.userForm.value;
    delete value.confirmPassword;

    firstValueFrom(this.userService.createUser(value)).then(res => {
      this.dialogRef.close(true);
    });
  }

  updateUser(){
    const updatedFields = Object.entries(this.userForm.controls).filter(item => item[1].dirty).reduce((a:any,c:any) => {
      a[c[0]] = c[1].value;
      return a;
    }, {});
    firstValueFrom(this.userService.updateUser(this.data.id, updatedFields)).then(res => {
      this.dialogRef.close(true);
    });
  }
}
