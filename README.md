# Booking System

## Bookwise frontend 2.0

The project now includes a responsive Bookwise 2.0 frontend served by the same Express application. It uses the existing API and supports authentication, appointment management, calendar view, payments, feedback, and profile settings.

### Run locally

```bash
npm install
copy .env.example .env
npm run migrate:mongo
npm start
```

Start the **MySQL** module in the XAMPP Control Panel before running these commands. The app creates the `bookingSystem` database and its tables automatically. The migration command copies the existing local MongoDB records into MySQL; keep MongoDB running for that step. Then open `http://localhost:3000`.

For a fresh, empty database, skip `npm run migrate:mongo`. The migration stops if the MySQL tables already contain data.

The default XAMPP MySQL account is `root` with an empty password. If yours is different, update `DB_USER` and `DB_PASSWORD` in `.env`. Replace the example `MY_SECRET` with a long random value. The migration source defaults to `mongodb://127.0.0.1:27017/bookingSystem`; set `MONGO_SOURCE_URI` in `.env` if the MongoDB source is elsewhere.

Ky është një projekt për menaxhimin e rezervimeve me Node.js dhe MySQL/MariaDB (XAMPP).

## Struktura e projektit

- **controllers/** – Logjika e kontrolluesve për secilën veçori (appointment, feedback, payment, user)
- **services/** – Shërbimet që përmbajnë logjikën e biznesit
- **routes/** – Rrugët për API-të
- **db/** – Lidhja dhe pyetjet për MySQL/MariaDB
- **scripts/** – Importimi njëherësh i të dhënave nga MongoDB
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
