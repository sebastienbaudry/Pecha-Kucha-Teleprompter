# Pecha‑Kucha Teleprompter

A web application that helps presenters manage Pecha‑Kucha style talks (20 slides, 20 seconds each) with optional custom slide durations.

## Features
- Create, edit, and view presentations
- Configure per‑slide duration (20‑45 seconds)
- Real‑time teleprompter view with automatic slide advancement
- PostgreSQL database (Neon.tech) for storing presentations and slides

## Getting Started

### Prerequisites
- **Node.js** (v18 or later)
- **npm** (comes with Node)
- **Neon.tech** PostgreSQL instance (or any PostgreSQL compatible database)

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd Pecha-Kucha-Teleprompter

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Environment Variables
Create a `.env` file in the `server` directory (or set the variables in your environment) with the following keys:

- `DATABASE_URL` – PostgreSQL connection string for your Neon.tech database, e.g. `postgresql://user:password@host/dbname`.
- `PORT` – Port on which the server will listen (default: `5000`).
- `NODE_ENV` – Set to `development` or `production` to control logging and debug behavior (optional).

These variables are read by the server at startup. `DATABASE_URL` is required; the server will log a warning if it is missing.

### Database Setup
1. Create a Neon.tech PostgreSQL project and obtain the connection string.
2. Set the `DATABASE_URL` environment variable as described above.
3. Run the migration script to create the required tables:
```bash
cd server
psql $DATABASE_URL -f init.sql
```

### Development
```bash
# Start the client (Vite dev server)
cd ../client
npm run dev

# The server serves static files; ensure `DATABASE_URL` is set before running the app.
```

## Project Structure
- `client/` – React front‑end
- `server/` – Server code and database migration script (`init.sql`)
- `shared/schema.ts` – TypeScript definitions for the data model

## Contributing
Feel free to open issues or submit pull requests. Follow the existing code style and run `npm run lint` before committing.

## License
MIT © 2025

