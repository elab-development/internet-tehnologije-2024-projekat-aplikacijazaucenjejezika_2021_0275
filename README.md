# Aplikacija za učenje jezika

Ova veb aplikacija omogućava korisnicima da uče strane jezike kroz interaktivne lekcije, prevode teksta i audio materijale. Aplikacija je razvijena kao deo projekta na predmetu **Internet tehnologije (ITEH)** na Fakultetu organizacionih nauka.

# GitHub link projekta

https://github.com/elab-development/internet-tehnologije-2024-projekat-aplikacijazaucenjejezika_2021_0275



## Tehnologije

### Frontend
- React (SPA – Single Page Application)
- React Router DOM
- React Hooks (useEffect, useState, itd.)
- CSS

### Backend
- PHP
- Laravel framework (v10)
- REST API (JSON komunikacija)
- MySQL baza podataka
- Autentifikacija preko Laravel Sanctum



## Ključne funkcionalnosti

- Registracija i prijava korisnika
- Prevođenje unetog teksta
- Prikaz dostupnih jezika i lekcija
- Označavanje lekcija kao pređenih
- Uloga profesora (dodavanje/izmena/brisanje jezika i lekcija)
- Dodavanje audio fajlova i slika uz lekciju
- Admin panel za pregled statistike


## Pokretanje projekta lokalno

### Backend (Laravel)
1. Kloniraj repozitorijum:
   ```
   git clone <repo-url>
   cd backend
   ```
2. Instaliraj zavisnosti:
   ```
   composer install
   ```

3. Podesi pristup bazi u `.env` fajlu, zatim pokreni migracije:
   ```
   php artisan migrate --seed
   ```
4. Pokreni Laravel server:
   ```
   php artisan serve
   ```

### Frontend (React)
1. Idi u frontend folder:
   ```
   cd frontend
   ```
2. Instaliraj zavisnosti:
   ```
   npm install
   ```
3. Pokreni React aplikaciju:
   ```
   npm start
   ```



## Struktura projekta

- `backend/` – Laravel aplikacija (kontroleri, modeli, rute, migracije, seederi)
- `frontend/` – React aplikacija (komponente, stranice, API pozivi)
- `database/` – MySQL shema sa povezanim entitetima: Korisnik, Jezik, Lekcija
- `public/` – Statika i asseti


