import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../firebase-auth'; // A szolgáltatás importálása

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html', // A képed alapján: login.html
  styleUrls: ['./login.css']
})
export class Login implements OnInit {
  
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  
  private authService = inject(FirebaseAuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  

  ngOnInit(): void {
    // Bejelentkezési űrlap inicializálása
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = null; // Hibaüzenet törlése
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      try {
        await this.authService.login(email, password);
        // Sikeres bejelentkezés után navigáljunk a listához (főoldalra)
        this.router.navigate(['/']); 
      } catch (error: any) {
        // Hibaüzenet megjelenítése (pl. 'auth/wrong-password')
        if (error.code === 'auth/invalid-credential') {
          this.errorMessage = 'Helytelen e-mail cím vagy jelszó.';
        } else {
          this.errorMessage = 'Hiba a bejelentkezéskor: Kérlek ellenőrizd az adataidat.';
        }
        
        this.cdr.detectChanges();
        console.error(error.code);
      }
    }
  }
}