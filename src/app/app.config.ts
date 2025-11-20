import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// Firebase importok
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';


// Firebase konfigurációs objektum
const firebaseConfig = {
  apiKey: "AIzaSyAxPiMQTJZUI02qcmWgwyQDtlBhL1xUnV8",
  authDomain: "tesztimesztike.firebaseapp.com",
  projectId: "tesztimesztike",
  storageBucket: "tesztimesztike.firebasestorage.app",
  messagingSenderId: "714769419498",
  appId: "1:714769419498:web:cda4374bbbf611c17e9b93",
  measurementId: "G-HEJE5HWT1D"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    // App Inicializálás: Ez a Fő Kapcsolat, ami megadja a kulcsokat.
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    // Szolgáltatások regisztrálása, amit használni szeretnénk
    provideFirestore(() => getFirestore()), // Firestore adatbázis
    provideAuth(() => getAuth()) // Hitelesítés
    //provideStorage(() => getStorage()) // Képek tárolására
  ]
};
