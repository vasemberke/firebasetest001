import { Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common'; // Szükséges az *ngFor és *ngIf-hez
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms'; // Az űrlapokhoz szükséges
import { CarService } from '../car';
import { Car } from '../models/car.interface';
import { Router, ActivatedRoute } from '@angular/router'; // Navigációhoz
import { take } from 'rxjs/operators'; // Csak egyszer olvassuk ki az adatot



@Component({
  selector: 'app-car-form',
  standalone: true,
  // A ReactiveFormsModule importálása
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './car-form.html',
  styleUrl: './car-form.css',
})
export class CarForm implements OnInit{
    
  carForm!: FormGroup; // Az űrlapcsoport
  
  private carService = inject(CarService);
  private fb = inject(FormBuilder);
  private router = inject(Router); 
  private route = inject(ActivatedRoute);


  carId: string | null = null; // Ide tároljuk az URL-ből érkező ID-t
  isEditMode: boolean = false; // Módosítási módban vagyunk-e?

  ngOnInit(): void {
    // Űrlap inicializálása a FormBuilder segítségével
    this.carForm = this.fb.group({
      make: ['', Validators.required],
      model: ['', Validators.required],
      // Validators: Rendszám validálása (3 betű - 3 szám)
      licensePlate: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-[0-9]{3}$/)]], 
      // Validators: Év validálása (szám, minimum 1900)
      year: ['', [Validators.required, Validators.min(1900)]], 
    });

    // 2. Útvonal paraméterek figyelése
    this.route.paramMap.subscribe(params => {
      this.carId = params.get('id'); // ID kiolvasása
      if (this.carId) {
        this.isEditMode = true;
        this.loadCarData(this.carId); // Adatok betöltése szerkesztéshez
      }
    });
  }

  // Adatok betöltése Firestore-ból (UPDATE-hez)
  loadCarData(id: string): void {
    // getCarById() metódust hívjuk, majd feliratkozunk rá, de csak az első értéket vesszük figyelembe (take(1)).
    this.carService.getCarById(id)
      .pipe(take(1)) // Fontos, hogy csak egyszer vegyük le az értéket!
      .subscribe(car => {
        if (car) {
          // patchValue: Csak a megadott mezőket tölti fel az űrlapban
          this.carForm.patchValue(car); 
        } else {
          // Ha nem találja az ID-t, visszairányítjuk
          alert('A keresett autó nem található!');
          this.router.navigate(['/']); 
        }
      });
  }

  /*
  // CREATE funkció (Létrehozás)
  onSubmit(): void {
    if (this.carForm.valid) {
      // Az űrlap adatainak lekérése
      const newCarData: Omit<Car, 'id'> = this.carForm.value;

      this.carService.addCar(newCarData)
        .then(() => {
          alert('Sikeresen hozzáadva az adatbázishoz!');
          this.carForm.reset(); // Az űrlap ürítése
          this.router.navigate(['/']); // Visszanavigálás a főoldalra (listához)
        })
        .catch(error => {
          console.error('Hiba az adatfelvitelkor:', error);
          alert('Hiba történt az adatok feltöltésekor!');
        });
    } else {
      alert('Kérlek, töltsd ki helyesen az összes mezőt!');
    }
  }*/

    // CREATE és UPDATE funkció (Létrehozás és Módosítás)
  onSubmit(): void {
    if (this.carForm.valid) {
      // Űrlap adatainak lekérése
      const carData: Car = this.carForm.value;
      let promise: Promise<any>;

      if (this.isEditMode && this.carId) {
        // --- UPDATE (Módosítás) ---
        carData.id = this.carId; // Beállítjuk az ID-t a frissítéshez
        promise = this.carService.updateCar(carData);
        console.log('Autó módosítása...');
      } else {
        // --- CREATE (Létrehozás) ---
        promise = this.carService.addCar(carData);
        console.log('Új autó hozzáadása...');
      }

      promise.then(() => {
        alert(this.isEditMode ? 'Sikeresen módosítva!' : 'Sikeresen hozzáadva!');
        this.router.navigate(['/']); // Vissza a listához
      }).catch(error => {
        console.error('Hiba a művelet közben:', error);
        alert('Hiba történt a mentés/frissítés közben.');
      });

    } else {
      alert('Kérlek, töltsd ki helyesen az összes mezőt!');
    }
  }
}
