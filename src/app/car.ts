import { inject, Injectable } from '@angular/core';
// Importáljuk a szükséges Firebase/Firestore függvényeket
import { 
  Firestore, collection, collectionData, doc, 
  addDoc, updateDoc, deleteDoc, DocumentReference, docData 
} from '@angular/fire/firestore'; 
import { Observable } from 'rxjs';
import { Car } from './models/car.interface'; // A létrehozott interfész importálása

@Injectable({
  providedIn: 'root',
})
export class CarService {
  // Firestore szolgáltatás injektálása az inject() függvénnyel
  private firestore: Firestore = inject(Firestore);
  
  // Hivatkozás a 'cars' gyűjteményre a Firestore-ban
  private carsCollection = collection(this.firestore, 'cars'); 

  // 1. READ (Adatok kiolvasása a listához)
  getCars(): Observable<Car[]> {
    // collectionData: valós idejű Observable-t ad vissza.
    // Az 'idField: 'id'' biztosítja, hogy a Firestore dokumentum ID-je bekerüljön a Car objektumba.
    return collectionData(this.carsCollection, { idField: 'id' }) as Observable<Car[]>;
  }

  // 2. CREATE (Új autó hozzáadása)
  addCar(car: Omit<Car, 'id'>): Promise<DocumentReference<unknown>> {
    // A Firestore automatikusan generál egy ID-t.
    return addDoc(this.carsCollection, car);
  }

  // 3. UPDATE (Adat módosítása)
  updateCar(car: Car): Promise<void> {
    // Hivatkozás a konkrét dokumentumra a megadott ID alapján
    const carDocRef = doc(this.firestore, `cars/${car.id}`);
    
    // updateDoc: frissíti a dokumentumot
    // A car.id mezőt kihagyjuk a feltöltéskor, mert csak a hivatkozáshoz kell.
    const { id, ...dataToUpdate } = car; 
    return updateDoc(carDocRef, dataToUpdate); 
  }

  // 4. DELETE (Adat törlése)
  deleteCar(id: string): Promise<void> {
    const carDocRef = doc(this.firestore, `cars/${id}`);
    return deleteDoc(carDocRef);
  }

  // 5. READ BY ID (Egy adott autó kiolvasása ID alapján)
  getCarById(id: string): Observable<Car> {
    // Hivatkozás a konkrét dokumentumra (Collection/ID)
    const carDocRef = doc(this.firestore, `cars/${id}`); 
    // docData: egyetlen dokumentumot ad vissza Observable-ben
    return docData(carDocRef, { idField: 'id' }) as Observable<Car>;
  }

}
