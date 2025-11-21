import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, Component, signal } from '@angular/core';
import { provideRouter, RouterOutlet, Routes } from '@angular/router';
// Firebase importok
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { CarList } from './car-list/car-list';
import { CarForm } from './car-form/car-form';
import { Login } from './login/login';


// 1. Definiáld az útvonalakat
const routes: Routes = [
  { path: '', component: CarList },           // Főoldal: Lista megjelenítése
  { path: 'add', component: CarForm },         // Új hozzáadása
  { path: 'edit/:id', component: CarForm },    // Szerkesztés (UPDATE) 
  { path: 'login', component: Login }, // Bejelentkezés
  { path: '**', redirectTo: '' }                      // Minden más: Főoldalra irányítás
];

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
