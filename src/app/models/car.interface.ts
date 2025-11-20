export interface Car {
    // A Firestore egyedi dokumentum azonosítója. Opcionális (?).
    // Akkor lesz rajta, ha kiolvassuk az adatbázisból, de nem akkor, ha felvisszük.
    id?: string; 
    make: string; // Márka (pl. "Suzuki")
    model: string; // Típus (pl. "Swift")
    licensePlate: string; // Rendszám (pl. "ABC-123")
    year: number; // Gyártási év (pl. 2020)
    // Megjegyzés: a Firestore az 'id' mezőt stringként adja vissza.
}