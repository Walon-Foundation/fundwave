
# FundwaveSL

FundWaveSL is Sierra Leone’s first dedicated crowdfunding platform, built to help individuals, communities, and organizations raise funds easily and securely. With local mobile money integration, zero platform fees, and bank-level security, FundWaveSL makes it simple to launch campaigns, receive donations, and withdraw funds. Trusted by thousands of users and supporting both local and international payments, the platform is tailored to Sierra Leone’s unique needs—empowering people to turn ideas and causes into real impact.


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.12.0-brightgreen)](https://nodejs.org/)
[![Nextjs](https://img.shields.io/badge/Nextjs-%23ff3e00.svg?style=flat&logo=nextjs&logoColor=white)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)



---

>  👩‍💻**Currently in active development. We welcome contributions and feedback from the community!**

---
## Features

- Easy Campaign Creation – Launch fundraising campaigns quickly with images, descriptions, and funding goals.
- Local & International Payments – Accept donations via mobile money, bank transfers, and international channels.
- Zero Platform Fees – Fundraisers keep all the funds they raise.
- Secure & Transparent – Bank-level security, KYC verification, and real-time tracking of donations.
- Multi-Channel Notifications – Stay updated via SMS, email, or WhatsApp(comming soon...).
- Inclusive & Localized – Designed for Sierra Leone, supporting local languages and payment infrastructure.
- Campaign Management – Edit campaigns, track progress, and withdraw funds safely.


## Tech Stack

## Client (Frontend)

- **[Next.js](https://nextjs.org)** – React framework for server-side rendering and static site generation.
- **[React](https://react.dev)** – UI library for building interactive interfaces.
- **[TailwindCSS](https://tailwindcss.com/)**: Utility-first CSS framework with custom design system
- **[Shadcn/ui](https://ui.shadcn.com/)**: Modern UI component.
- **[Typescripts](https://www.typescriptlang.org/)** - Ui component library.

## Backend

- **[PostgreSQL](https://www.postgresql.org/)**: Robust relational database for data persistence
- **[Node.js](https://nodejs.org/)**: Server-side JavaScript runtime environment
- **[Drizzle](https://orm.drizzle.team/)** – ORM for database modeling and queries.

## External Tools & Integrations

- **[Monime](https://monime.io)** – Payment processing.
- **[Vercel](https://vercel.com)** – Hosting, CDN, and deployment.

## Quality Assurance

- **[Prettier](https://prettier.io/)**: Code formatting for consistent style
- **[ESLint](https://eslint.org/)**: Code linting for quality assurance
- **[GitHub Actions](https://github.com/features/actions)**: Continuous integration and deployment

## Project structure

```
fundwave/
    ├── .gitignore
    ├── LICENSE
    ├── README.md
    ├── app
    |  ├── about
    |  |  ├── page.tsx
    |  ├── api
    |  |  ├── campaigns
    |  |  |  ├── [id]
    |  |  |  |  ├── cash-out
    |  |  |  |  |  ├── route.ts
    |  |  |  |  ├── comments
    |  |  |  |  |  ├── [commentId]
    |  |  |  |  |  |  ├── route.ts
    |  |  |  |  |  ├── route.ts
    |  |  |  |  ├── payments
    |  |  |  |  |  ├── route.ts
    |  |  |  |  ├── report
    |  |  |  |  |  ├── route.ts
    |  |  |  |  ├── route.ts
    |  |  |  ├── user-created
    |  |  |  |  ├── route.ts
    |  |  |  ├── user-deleted
    |  |  ├── page.tsx
    |  ├── dashboard
    |  |  ├── page.tsx
    |  ├── error.tsx
    |  ├── favicon.ico
    |  ├── globals.css
    |  ├── help
    ├── assets
    |  ├── assets.ts
    |  ├── logo.png
    |  ├── nema.jpg
    |  ├── swaray.jpg
    |  ├── tjalloh.jpg
    |  ├── walon.jpg
    ├── components
    |  ├── ClientLayoutWrapper.tsx
    |  ├── campaign-card.tsx
    |  ├── cashout-modal.tsx
    |  ├── ui
    |  |  ├── accordion.tsx
    |  |  ├── alert-dialog.tsx
    |  |  ├── alert.tsx
    |  |  ├── aspect-ratio.tsx
    |  |  ├── avatar.tsx
    |  |  ├── badge.tsx
    |  |  ├── breadcrumb.tsx
    |  |  ├── button.tsx
    |  |  ├── calendar.tsx
    |  |  ├── card.tsx
    |  |  ├── carousel.tsx
    |  |  ├── checkbox.tsx
    |  |  ├── collapsible.tsx
    |  |  ├── command.tsx
    |  |  ├── context-menu.tsx
    |  |  ├── dialog.tsx
    |  |  ├── drawer.tsx
    |  |  ├── dropdown-menu.tsx
    |  |  ├── form.tsx
    |  |  ├── hover-card.tsx
    ├── components.json
    ├── db
    |  ├── drizzle
    |  |  ├── 0000_heavy_mother_askani.sql
    |  |  |  ├── 0005_snapshot.json
    |  ├── drizzle.ts
    |  ├── schema.ts
    ├── drizzle.config.ts
    ├── eslint.config.mjs
    ├── lib
    |  ├── ai.ts
    |  ├── api
    |  |  ├── api.ts
    |  ├── logger.ts
    |  ├── monime.ts
    |  ├── nodeMailer.ts
    |  ├── notification.ts
    |  ├── supabase.ts
    |  ├── utils.ts
    ├── middleware.ts
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.mjs
    ├── public
    |  ├── robots.txt
    ├── styles
    |  ├── globals.css
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── types
    |  ├── api.ts
    |  ├── monimeTypes.ts
    ├── validations
    |  ├── campaign.ts
    |  ├── comment.ts
    |  ├── payment.ts
    |  ├── update.ts
    |  ├── user.ts
    |  ├── withdrawal.ts

```
## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed on your development machine:

- **Node.js** (v20.12.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** as package manager
- **Git** for version control
- **Vercel CLI** (optional, for deployment) - [Install Guide](https://vercel.com/cli)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Walon-Foundation/fundwave.git
   cd fundwave
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Then configure your `.env` file with the following variables:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # clerk Configuration
   CLERK_SECRET_KEY=*******
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=*****
   WEBHOOK_SECRET=**********

   # Database Configuration
   DATABASE_BASE_URL=***************
   
   # Monime Configuration
   MONIME_SPACE_ID=************
   MONIME_ACCESS_TOKEN=**********
   MONIME_MAIN_ACCOUNT_ID_PROD=******************

   # SMTP Configuration
   GOOGLE_SMTP_EMAIL=***********
   GOOGLE_SMTP_PASSWORD=*****************

   NODE_ENV=********************
   ```
4. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Your application will be available at `http://localhost:3000`

### Development Commands

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run start

# Lint
npm run lint
```
## Lessons Learned

What did you learn while building this project? What challenges did you face and how did you overcome them?


## Contributing


We welcome contributions from developers, designers, and DPG enthusiasts! Here's how you can get involved:

### Getting Started
1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a feature branch** from `main`
4. **Make your changes** following our coding conventions
5. **Test your changes** thoroughly
6. **Submit a pull request** with a clear description

### Development Guidelines
- Follow the existing code style and conventions
- Write meaningful commit messages
- Include tests for new features
- Update documentation when necessary
- Keep PRs focused and manageable in size

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

### Code of Conduct
We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our Code of Conduct.

## 🌍 Community & Support

### Get Help
- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/Walon-Foundation/fundawave/issues)
- **Discussions**: Join community discussions on [GitHub Discussions](https://github.com/christex-foundation/pipeline/discussions)
- **Documentation**: Comprehensive guides in the `/docs` directory

### Stay Updated
- **Watch** the repository for updates
- **Star** the project if you find it useful
- **Follow** [@Walon-Foundation](https://github.com/Walon-Foundation) for announcements
## License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.


## Acknowledgements

- **Walon-Foundation** for project sponsorship and support
- **Open Source Community** for the amazing tools and libraries that make this project possible
- **Contributors** who help improve and maintain this platform




