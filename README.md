
---

# Fundwave

![Fundwave](favicon.ico) 

A modern crowdfunding web application built with **Next.js**, **TypeScript**, and **MongoDB**. This platform allows users to create, fund, and manage campaigns, with features for user authentication, campaign creation, payment integration, and an admin dashboard for managing the platform.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Routes](#api-routes)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication**: Secure signup, login, and email verification for users.
- **Campaign Management**: Create, update, and view crowdfunding campaigns with rich media (pictures, descriptions).
- **Payment Integration**: Support for funding campaigns via secure payment gateways.
- **Admin Dashboard**: Dedicated admin panel for managing users, campaigns, and platform settings.
- **User Dashboard**: Dedicated user panel for managing  campaigns and funds received from each campaign.
- **Profile Management**: Users can view and edit their profiles.
- **Responsive Design**: Mobile-friendly UI with a clean and intuitive layout.
- **Type Safety**: Built with TypeScript for better code reliability and maintainability.

---

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS (assumed based on `globals.css`)
- **Backend**: Next.js API Routes, MongoDB
- **Node mailer**: For sending emails
- **Supabase**: For image storage
- **Authentication**: Custom auth system with JWT (assumed based on your setup)
- **Database**: MongoDB for storing users, campaigns, and payments
- **Deployment**: Vercel
- **Libraries**:
  - `bcrypt` for password hashing
  - `jsonwebtoken` for session management
  -  `shadcn ui` for reuseable components
  - Other utilities (e.g., `mongoose` for MongoDB, assumed based on `models`)

---

## Folder Structure

Here’s an overview of the project’s structure:

```
├── public/                     # Static assets (images, favicon.ico)
├── src/                        # Source code
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication routes
│   │   │   ├── campaign/       # Campaign routes
│   │   │   ├── payment/        # Payment routes
│   │   │   └── update/         # Update routes
│   │   ├── (auth)/             # Authentication-related pages
│   │   │   ├── admin/          # Admin dashboard
│   │   │   │   └── page.tsx
│   │   │   ├── login/          # Login page
│   │   │   │   └── page.tsx
│   │   │   ├── profile/        # User profile page
│   │   │   │   └── page.tsx
│   │   │   ├── signup/         # Signup page
│   │   │   │   └── page.tsx
│   │   │   └── verifyemail/    # Email verification page
│   │   │       └── page.tsx
│   │   ├── campaign/[id]/      # Dynamic route for viewing campaigns
│   │   │   └── page.tsx
│   │   ├── create/             # Campaign creation page
│   │   │   └── page.tsx
│   │   ├── payment/            # Payment page for funding campaigns
│   │   │   └── page.tsx
│   │   ├── globals.css         # Global styles (Tailwind CSS)
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/             # Reusable UI components
│   │   ├── campaign/           # Campaign-related components
│   │   │   └── campaignCard.tsx
│   │   ├── designSectionUI/    # UI sections for design
│   │   │   ├── commentCard.tsx
│   │   │   ├── commenterCard.tsx
│   │   │   ├── creatorCard.tsx
│   │   │   ├── shareCard.tsx
│   │   │   └── updateSection.tsx
│   │   └── forms/              # Form components
│   │   │   └── heroPart.tsx
│   ├── ui/                     # Shared UI components
│   │   ├── campaign-picture-preview.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── core/                   # Core logic and utilities
│   │   ├── api/                # API routes
│   │   │   ├── axiosInstance   # for cookies to be sent easily
│   │   ├── configs/            # Configuration files
│   │   ├── helpers/            # Helper functions
│   │   ├── hooks/              # Custom React hooks
│   │   ├── models/             # MongoDB models (e.g., User, Campaign)
│   │   ├── store/              # State management (if any)
│   │   ├── types/              # TypeScript types
│   │   ├── validators/         # Input validation logic
│   │   └── lib/                # Utility libraries
│   ├── profile-picture-preview.tsx # Profile picture preview component
│   └── middleware.ts           # Middleware for route protection
├── .env                        # Environment variables
├── .env.example                # Example environment variables
├── components.json             # Component configurations
├── eslint.config.mjs           # ESLint configuration
├── license.txt                 # License file
└── next-env.d.ts               # Next.js TypeScript definitions
```

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **MongoDB**: Either a local instance or MongoDB Atlas account
- **Vercel CLI** (optional): For deployment

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/walonCode/fundwave.git
   cd crowdfunding-platform
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set Up MongoDB**:
   - If using MongoDB Atlas, create a cluster and get your connection string.
   - If using a local instance, ensure MongoDB is running on `mongodb://localhost:27017`.

---

## Environment Variables

Create a `.env` file in the root directory and add the following variables (use `.env.example` as a reference):

```
DATABASE_URI=mongodb uri
ACCESS_TOKEN_SECRET=some secret key
USER_TOKEN_SECRET=some secret key
SESSION_TOKEN_SECRET= some secret key
VERIFICATION_TOKEN_SECRET=some secret key
NEXT_PUBLIC_SUPABASE_URL= from supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY= from supabase
SERVICE_ROLE_KEY= from supabase
NODE_ENV= production or development
EMAIL= to shot email using node mailer
PASSWORD=
```

- Replace `<username>`, `<password>`, `<cluster>`, and `<dbname>` with your MongoDB Atlas credentials.
- Generate a `JWT_SECRET` (e.g., a random string like `mysecretkey123`).
- Add payment gateway keys if applicable (e.g., Stripe).

---

## Running the App

1. **Development Mode**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

2. **Build and Start (Production)**:
   ```bash
   npm run build
   npm run start
   # or
   yarn build
   yarn start
   ```

3. **Deploy to Vercel**:
   - Push your code to a GitHub repository.
   - Link the repository to Vercel via the Vercel dashboard.
   - Add the environment variables in Vercel’s dashboard under Settings > Environment Variables.
   - Deploy!

---

## API Routes

The app uses Next.js API routes for backend functionality. Key endpoints include:

- **Authentication**:
  - `POST /api/auth/signup`: Register a new user.
  - `POST /api/auth/login`: Log in a user and return a JWT.
- **Campaign**:
  - `POST /api/campaign`: Create a new campaign.
  - `GET /api/campaign/[id]`: Get campaign details.
- **Payment**:
  - `POST /api/payment`: Process a payment for a campaign.
- **Update**:
  - `POST /api/update`: Update campaign details (admin only).

All routes are protected where necessary using middleware (see `middleware.ts`).

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit: `git commit -m "Add your feature"`.
4. Push to your branch: `git push origin feature/your-feature-name`.
5. Create a pull request.

Please ensure your code follows the project’s ESLint rules (`eslint.config.mjs`).

---

## License

This project is licensed under the [MIT License](license.txt).

---

### Notes for Your Project
- **Middleware**: Your `middleware.ts` is already set up to protect routes like `/admin`. Ensure it checks the `role` field in the JWT to restrict access.
- **Admin Dashboard**: Located at `/app/(auth)/admin`, it’s protected for users with `role: "admin"`.
- **Campaign Features**: Components like `campaignCard.tsx` and pages like `/campaign/[id]` suggest a focus on campaign display and interaction.
- **Dynamic Routes**: The `/campaign/[id]` route indicates dynamic routing for campaign details.

This README provides a clear starting point for your project while being professional and detailed. If you’d like to add more sections (e.g., testing setup, deployment tips, or specific features), let me know! How does this look for your crowdfunding app?