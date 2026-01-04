import { Component, effect, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../application/auth/auth.service';
import { RegisterRequest } from '../../../domain/dtos/register-request';
import { merge } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  imports: [ReactiveFormsModule],
})
export class Register {
  error = signal<string | null>(null);
  success = signal<boolean>(false);

  form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phoneNumber: new FormControl('', { nonNullable: true }), // optional
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  // Computed signal to check if passwords match
  passwordMismatch = signal(false);

  constructor(private authService: AuthService) {
    merge(
      this.form.controls.password.valueChanges,
      this.form.controls.confirmPassword.valueChanges
    ).subscribe(() => {
      this.passwordMismatch.set(
        this.form.controls.password.value !== this.form.controls.confirmPassword.value
      );
    });
  }

  submit() {
    if (this.form.invalid || this.passwordMismatch()) {
      this.error.set(
        this.passwordMismatch()
          ? 'Passwords do not match'
          : 'Please fill all required fields correctly'
      );
      this.success.set(false);
      return;
    }

    const payload: RegisterRequest = {
      firstName: this.form.controls.firstName.value,
      lastName: this.form.controls.lastName.value,
      email: this.form.controls.email.value,
      phoneNumber: this.form.controls.phoneNumber.value ?? '',
      password: this.form.controls.password.value,
    };
    console.log(payload);
    this.authService.register(payload).subscribe({
      next: () => {
        this.success.set(true);
        this.error.set(null);
        this.form.reset(); // reset all controls
      },
      error: (err) => {
        let msg = 'Registration failed';

        // If backend sends validation errors object
        if (err.error?.errors) {
          msg = Object.values(err.error.errors).flat().join(', ');
        }

        // If backend sends a message string
        else if (err.error) {
          msg = err.error;
        }

        this.error.set(msg);
        this.success.set(false);
      },
    });
  }
}
