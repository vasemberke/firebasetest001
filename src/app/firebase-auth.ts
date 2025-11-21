import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  signOut, 
  User, 
  onAuthStateChanged 
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  
  private auth: Auth = inject(Auth);
  
  // 1. Megfigyeli a bejelentkezés állapotát (ki van bejelentkezve)
  user$: Observable<User | null>; 

  constructor() {
    // onAuthStateChanged függvény az Observable-hez
    this.user$ = new Observable<User | null>(observer => {
      onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
    });
  }

  // 2. Bejelentkezés (LOGIN)
  async login(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Bejelentkezési hiba:", error);
      throw error;
    }
  }

  // 3. Kijelentkezés (LOGOUT)
  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  // 4. Az aktuális felhasználó lekérdezése (szinkron)
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}