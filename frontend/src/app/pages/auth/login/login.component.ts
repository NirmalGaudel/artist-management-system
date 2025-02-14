import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { globalModules, materialModules } from '../../../gobalModules';

@Component({
  selector: 'app-login',
  imports: [
    ...globalModules,
    ...materialModules
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}
  loginForm: FormGroup = new FormGroup({});
  passwordVisibility = false;
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    // Check if the form is valid
    if (!this.loginForm.valid) {
      return;
    }

    // Call the login method from the AuthService
    this.authService.login(this.loginForm?.value).subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
