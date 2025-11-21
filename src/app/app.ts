import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Route, provideRouter } from '@angular/router'; // Útválasztáshoz
import { CarList } from './car-list/car-list';
import { CarForm } from './car-form/car-form';
import { Routes } from '@angular/router';





@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, CarList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('firebasetest001');
}
