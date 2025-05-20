# FundWave

FundWave is a robust platform designed to help manage and track fundraising campaigns effectively. Built using modern web technologies, FundWave allows users to create and manage campaigns, verify users and their KYC, and manage payments via Supabase.

## Features

- **User Authentication** : Secure user login, signup, password recovery, and verification.
- **KYC Management** : KYC system for user verification.
- **Campaign Management**: Create, update, and view fundraising campaigns.
- **Payment Integration**: Manage and track payments for campaigns.
- **Campaign Analytics**: Real-time analytics and progress tracking for each campaign.
- **Information Pages**: Static pages for about us, contact us, how it works, and privacy policy.
- **UI Components**: Reusable UI components for a seamless user experience.

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/your-repo/fundwave.git
    cd fundwave
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up environment variables:**
    Copy the `.env.example` file to `.env` and configure the environment variables accordingly.

4. **Start the development server:**
    ```sh
    npm run dev
    ```

## Usage

FundWave offers a simple yet powerful interface to manage fundraising campaigns from the creation to updates and payments. Here’s how you can use it:

- **User Flow**:
  - Visit the homepage to see featured campaigns.
  - Navigate to the login page to authenticate.
  - Complete your KYC verification if prompted.
  - Create a campaign or update an existing one.

- **Admin Dashboards**:
  - Access the admin dashboard for an overview of all campaigns.
  - Manage campaigns, user activities, and payments.

- **Information Pages**:
  - Learn more about the platform, how it works, and privacy policies through static pages.

## Technologies

- **Frontend**: React, Next.js
- **Database**: Supabase, MongoDB
- **Authentication**: JsonWebToken, BcryptJS
- **Styling**: Tailwind CSS
- **Email Service**: Nodemailer

## Configuration and Environment

Ensure you have the following environment variables set in your `.env` file:

```plaintext
DATABASE_URI=
ACCESS_TOKEN_SECRET=
USER_TOKEN_SECRET=
SESSION_TOKEN_SECRET=
VERIFICATION_TOKEN_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SERVICE_ROLE_KEY=
NODE_ENV=
EMAIL=
PASSWORD=
```

## Folder Structure

```
├── .env
├── .env.example
├── .gitignore
├── README.md
├── components.json
├── eslint.config.mjs
├── license.txt
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
├── src
│  ├── app
│  │  ├── (Auth)
│  │  │  ├── admin
│  │  │  │  ├── dashboard
│  │  │  │  │  ├── page.tsx
│  │  │  │  ├── login
│  │  │  │  │  ├── page.tsx
│  │  │  │  ├── kyc
│  │  │  │  │  ├── page.tsx
│  │  │  │  ├── login
│  │  │  │  │  ├── page.tsx
│  │  │  │  ├── profile
│  │  │  │  │  ├── page.tsx
│  │  │  │  ├── signup
│  │  │  │  │  ├── page.tsx
│  │  │  │  ├── verification
│  │  │  │  │  ├── page.tsx
│  │  │  │  ├── verifyemail
│  │  │  │  │  ├── page.tsx
│  │  ├── (Info)
│  │  │  ├── aboutus
│  │  │  │  ├── page.tsx
│  │  │  ├── contactus
│  │  │  │  ├── page.tsx
│  │  │  ├── howitworks
│  │  │  │  ├── page.tsx
│  │  │  ├── privacypolicy
│  │  │  │  ├── page.tsx
│  │  ├── (campaign_folder)
│  │  │  ├── campaign
│  │  │  │  ├── [id]
│  │  │  │  │  ├── page.tsx
│  │  │  │  ├── create
│  │  │  │  |  ├── page.tsx
│  │  │  │  ├── page.tsx
│  │  │  ├── payment
│  │  │  │  ├── page.tsx
│  │  ├── api
│  │  │  ├── auth
│  │  │  │  ├── forgotpassword
│  │  │  │  │  ├── route.ts
│  │  │  │  ├── login
│  │  │  │  │  ├── route.ts
│  │  │  │  ├── logout
│  │  │  │  │  ├── route.ts
│  │  │  │  ├── register
│  │  │  │  │  ├── route.ts
│  │  │  │  ├── update
│  │  │  │  │  ├── route.ts
│  │  │  │  ├── users
│  │  │  │  │  ├── [userId]
│  │  │  │  │  │  ├── route.ts
│  │  │  │  │  ├── route.ts
│  │  │  │  ├── verify
│  │  │  │  │  ├── route.ts
│  │  │  ├── campaign
│  │  │  │  ├── [campaignId]
│  │  │  │  │  ├── comment
│  │  │  │  │  │  ├── route.ts
│  │  │  │  │  ├── route.ts
│  │  │  │  │  ├── update
│  │  │  │  │  │  ├── route.ts
│  │  │  │  ├── route.ts
│  │  │  ├── comment
│  │  │  │  ├── [commentId]
│  │  │  │  │  ├── route.ts
│  │  │  │  ├── route.ts
│  │  │  ├── payment
│  │  │  ├── update
│  │  │  │  ├── [updateId]
│  │  │  │  │  ├── route.ts
│  │  │  │  ├── route.ts
│  │  ├── dashboard
│  │  │  ├── page.tsx
│  │  ├── favicon.ico
│  │  ├── globals.css
│  │  ├── layout.tsx
│  │  ├── page.tsx
│  ├── assets
│  │  ├── aprof.jpg
│  │  ├── assets.ts
│  │  ├── bootcamp.jpg
│  │  ├── cancer.jpg
│  │  ├── clean.jpg
│  │  ├── f_logo.png
│  │  ├── funding.png
│  │  ├── g2_logo.png
│  │  ├── holder.png
│  │  ├── knee.jpg
│  │  ├── logo.png
│  │  ├── mobilmed.jpg
│  │  ├── nema.jpg
│  │  ├── soladdress.jpg
│  │  ├── solar.jpg
│  │  ├── stadium.jpg
│  │  ├── swaray.jpg
│  │  ├── tjalloh.jpg
│  │  ├── walon.jpg
│  │  ├── water.jpg
│  ├── components
│  │  ├── Footer.tsx
│  │  ├── Navbar.tsx
│  │  ├── campaign
│  │  │  ├── designSection
│  │  │  │  ├── commentSection.tsx
│  │  │  │  ├── creatorCard.tsx
│  │  │  │  ├── dashboardUI
│  │  │  │  │  ├── campaignCard.tsx
│  │  │  │  │  ├── commentCard.tsx
│  │  │  │  ├── shareCard.tsx
│  │  │  │  ├── updateSection.tsx
│  │  │  ├── forms
│  │  │  │  ├── campaignCreateForm.tsx
│  │  │  │  ├── commentForm.tsx
│  │  │  │  ├── updateForm.tsx
│  │  ├── campaign-picture-preview.tsx
│  │  ├── heroPart
│  │  │  ├── FeatureCampaign.tsx
│  │  │  ├── Hero.tsx
│  │  │  ├── Impact.tsx
│  │  │  ├── Info.tsx
│  │  ├── profile-picture-preview.tsx
│  │  ├── ui
│  │  │  ├── alert.tsx
│  │  │  ├── avatar.tsx
│  │  │  ├── badge.tsx
│  │  │  ├── button.tsx
│  │  │  ├── calendar.tsx
│  │  │  ├── card.tsx
│  │  │  ├── checkbox.tsx
│  │  │  ├── dropdown-menu.tsx
│  │  │  ├── input.tsx
│  │  │  ├── label.tsx
│  │  │  ├── pagination.tsx
│  │  │  ├── popover.tsx
│  │  │  ├── progress.tsx
│  │  │  ├── select.tsx
│  │  │  ├── separator.tsx
│  │  │  ├── sheet.tsx
│  │  │  ├── table.tsx
│  │  │  ├── tabs.tsx
│  │  │  ├── textarea.tsx
│  ├── core
│  │  ├── api
│  │  │  ├── axiosInstance.ts
│  │  ├── configs
│  │  │  ├── mongoDB.ts
│  │  │  ├── nodemailer.ts
│  │  │  ├── supabase.ts
│  │  ├── helpers
│  │  │  ├── apiResponse.ts
│  │  │  ├── calculateDayRemaining.ts
│  │  │  ├── calculateFundingPercentage.ts
│  │  │  ├── catergoryColor.ts
│  │  │  ├── errorHandler.ts
│  │  │  ├── formatDate.ts
│  │  │  ├── jwtHelpers.ts
│  │  ├── hooks
│  │  │  ├── storeHooks.ts
│  │  │  ├── use-mobile.tsx
│  │  │  ├── useAuthRedirect.ts
│  │  │  ├── useIsCampaign.ts
│  │  ├── models
│  │  │  ├── campaignModel.ts
│  │  │  ├── commentModel.ts
│  │  │  ├── updateModel.ts
│  │  │  ├── userModel.ts
│  │  ├── store
│  │  │  ├── features
│  │  │  │  ├── campaigns
│  │  │  │  │  ├── campaignSlice.ts
│  │  │  │  ├── comments
│  │  │  │  │  ├── commentSlice.ts
│  │  │  │  ├── update
│  │  │  │  │  ├── updateSlice.ts
│  │  │  │  ├── user
│  │  │  │  │  ├── userSlice.ts
│  │  │  ├── store.ts
│  │  │  ├── storeProvider.tsx
│  │  ├── types
│  │  │  ├── slicesTypes.ts
│  │  │  ├── types.ts
│  │  ├── validators
│  │  │  ├── campaign.schema.ts
│  │  │  ├── comment.schema.ts
│  │  │  ├── update.schema.ts
│  │  │  ├── user.schema.ts
│  ├── lib
│  │  ├── utils.ts
│  ├── middleware.ts
├── tailwind.config.ts
├── tsconfig.json
```

## Authors

**[Your Name](https://github.com/yourhandle)** - Initial work and concepts.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b my-new-feature`.
3. Make your changes and commit them: `git commit -am 'Add some feature'`.
4. Push to the branch: `git push origin my-new-feature`.
5. Submit a pull request.