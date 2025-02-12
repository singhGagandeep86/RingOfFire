import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyC1QJVAAoS58PYwo0aNUpnwfiPZhDRJ5o0",
      authDomain: "ring-of-fire-6a0c0.firebaseapp.com",
      projectId: "ring-of-fire-6a0c0",
      storageBucket: "ring-of-fire-6a0c0.firebasestorage.app",
      messagingSenderId: "675539075922",
      appId: "1:675539075922:web:1283e803e31f851b38f08b"
    })),
    provideFirestore(() => getFirestore()),
  ]
};
