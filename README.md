# Booking System

## Bookwise frontend 2.0

The project now includes a responsive Bookwise 2.0 frontend served by the same Express application. It uses the existing API and supports authentication, appointment management, calendar view, payments, feedback, and profile settings.

### Run locally

```bash
npm install
copy .env.example .env
npm start
```

Open `http://localhost:3000`. MongoDB must be running locally, or `MONGO_URI` can point to an accessible MongoDB instance.

Ky është një projekt për menaxhimin e rezervimeve, i ndarë në module të ndryshme si: models, controllers, services, dhe routes.

## Struktura e projektit

- **controllers/** – Logjika e kontrolluesve për secilën veçori (appointment, feedback, payment, user)
- **models/** – Modelet e të dhënave për secilën veçori
- **services/** – Shërbimet që përmbajnë logjikën e biznesit
- **routes/** – Rrugët për API-të
- **db/** – Lidhja me bazën e të dhënave
- **middleware/** – Middleware për autentikim dhe validim

## Si të përdorësh projektin

1. Shkarko projektin:
   ```bash
   git clone https://github.com/blerionstatovci/booking-system.git
   ```
2. Instalo varësitë:
   ```bash
   npm install
   ```
3. Starto aplikacionin:
   ```bash
   node app.js
   ```


## Branch-et kryesore

- **main** – Kodu stabil/prodhues
- **develop** – Zhvillimi aktiv
- **feature/feedback** – Veçori e re për feedback
- **feature/appointment** – Veçori e re për appointment
- **bugfix/payment** – Rregullim gabimi te pagesat
- **hotfix/security** – Ndryshime urgjente për siguri

## Kontributi

1. Krijo një issue për çdo problem ose veçori të re
2. Krijo një branch të ri për detyrën tënde
3. Bëj pull request kur të përfundosh

## Licenca

Ky projekt është për qëllime edukative.
