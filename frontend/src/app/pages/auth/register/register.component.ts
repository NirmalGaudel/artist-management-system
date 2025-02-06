import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../../validators/must-match.validator';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { globalModules, materialModules } from '../../../gobalModules';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [...globalModules, ...materialModules],
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group(
      {
        first_name: ['', [Validators.required, Validators.minLength(3)]],
        last_name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Assuming 10-digit phone number
        gender: ['', [Validators.required]], // 'male', 'female', 'other'
        address: ['', [Validators.required, Validators.minLength(5)]]
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  onSubmit() {
    // Check if the form is valid
    if (!this.registrationForm.valid) {
      this.toastService.error("Please review your data")
      return;
    }

    // Call the login method from the AuthService
    this.authService.register(this.registrationForm?.value).subscribe({
      next: (response) => {
        this.toastService.success("Registration successful, Please login.");
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get passwordMismatch() {
    return (
      this.registrationForm.hasError('mustMatch') &&
      this.registrationForm.get('confirmPassword')?.touched
    );
  }
}
