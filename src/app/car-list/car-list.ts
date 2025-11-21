import { Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common'; // Szükséges az *ngFor és *ngIf-hez
import { Observable } from 'rxjs';
import { CarService } from '../car';
import { Car } from '../models/car.interface';
import { Router, RouterLink } from '@angular/router';
import { FirebaseAuthService } from '../firebase-auth';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, RouterLink], // Importáld a CommonModule-t, mivel standalone
  templateUrl: './car-list.html',
  styleUrl: './car-list.css',
})
export class CarList implements OnInit{
  // A CarService injektálása
  private carService = inject(CarService); 
  private router = inject(Router); // Router injektálása
  private authService = inject(FirebaseAuthService); // A szolgáltatás injektálása
  
  user$ = this.authService.user$; // Megfigyeli a bejelentkezés állapotát.

  // Az Observable-t aszinkron csövön (async pipe) keresztül kezeljük a HTML-ben
  cars$!: Observable<Car[]>; 

  ngOnInit(): void {
    // Az autók valós idejű lekérdezése
    this.cars$ = this.carService.getCars();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigate(['/login']); // Kijelentkezés után a login oldalra navigál
  }

  // Törlés metódus
  deleteCar(id: string | undefined): void {
    if (id && confirm('Biztosan törölni szeretnéd ezt az autót az adatbázisból?')) {
      this.carService.deleteCar(id)
        .then(() => console.log('Sikeres törlés: ', id))
        .catch(err => console.error('Hiba törléskor:', err));
    }
  }

  editCar(car: Car): void {
    if (car.id) {
      this.router.navigate(['/edit', car.id]);
    } 
  }
}
