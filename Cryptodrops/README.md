# Cryptodrops - Airdrop Management Platform

A full-stack web application for managing and tracking cryptocurrency airdrops.

## Features

- Browse and filter cryptocurrency airdrops
- Admin panel for managing airdrops
- User authentication with JWT
- Newsletter subscription system
- Real-time updates with WebSocket support
- Responsive design

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd Cryptodrops
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your actual values:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens (generate using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- `ADMIN_USERNAME` - Initial admin username
- `ADMIN_PASSWORD` - Initial admin password
- `NODE_ENV` - Set to `development` or `production`

Optional:
- `RESEND_API_KEY` - For email functionality
- `RESEND_FROM_EMAIL` - Sender email address
- `ALLOWED_ORIGINS` - CORS origins for production

4. Initialize the database:
```bash
npm run setup
```

5. Create an admin user:
```bash
npm run setup-admin
```

## Running the Application

### Development
```bash
npm start
```

The application will be available at `http://localhost:5000`

### Database Commands

- **Reset database**: `npm run reset-db`
- **Push schema changes**: `npm run db:push`
- **Open Drizzle Studio**: `npm run db:studio`

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run integration tests only
npm run test:integration

# Run unit tests only
npm run test:unit
```

## Project Structure

```
Cryptodrops/
├── public/              # Frontend files
│   ├── js/
│   │   ├── frontend/   # Frontend modules
│   │   └── admin.js    # Admin panel
│   ├── index.html      # Main page
│   ├── admin.html      # Admin page
│   └── style.css       # Styles
├── server/             # Backend files
│   ├── config/         # Configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── utils/          # Utilities
├── .env.example        # Environment template
└── package.json        # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout

### Airdrops
- `GET /api/airdrops` - Get all airdrops
- `GET /api/airdrops/:id` - Get airdrop by ID
- `POST /api/airdrops` - Create airdrop (admin only)
- `PUT /api/airdrops/:id` - Update airdrop (admin only)
- `DELETE /api/airdrops/:id` - Delete airdrop (admin only)

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

## Security Notes

- Never commit your `.env` file to version control
- Use strong passwords for admin accounts
- Generate a secure JWT secret
- In production, enable HTTPS and set proper CORS origins

## License

ISC
