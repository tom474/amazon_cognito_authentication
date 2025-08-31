# TechStore - E-commerce Platform with Amazon Cognito

A modern e-commerce platform built with Next.js, TailwindCSS, and Shadcn UI components, featuring Amazon Cognito authentication with multiple user roles.

## Features

### Authentication System (Amazon Cognito)

-   **User Registration** with email verification
-   **Secure Sign-in** with password complexity requirements
-   **Password Reset** functionality
-   **MFA Support** (can be enabled in Cognito)
-   **Three User Roles**:
    -   **Public Users**: Browse products, view details
    -   **Regular Users**: All public features + shopping cart, checkout, order history
    -   **Admin Users**: All user features + product management, user management, analytics

### E-commerce Features

-   **Product Catalog**: Phones, tablets, and laptops
-   **Shopping Cart**: Add, remove, update quantities
-   **User Role-Based Access Control**
-   **Responsive Design** with TailwindCSS
-   **Modern UI Components** with Shadcn

## AWS Cognito Setup Instructions

### Step 1: Create User Pool

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Choose **User Pools** → **Create user pool**
3. **Sign-in experience**:
    - Choose **Email** as sign-in option
    - Enable **Email** for user registration
4. **Security requirements**:
    - Password policy: At least 8 characters, uppercase, lowercase, numbers, special characters
    - Enable **MFA** (optional but recommended)
5. **Sign-up experience**:
    - Enable **self-registration**
    - Require **email verification**
6. **Message delivery**:
    - Choose **Send email with Cognito** (or configure SES for production)
7. **User pool name**: `techstore-users`
8. **App client**:
    - App client name: `techstore-web`
    - Don't generate a client secret (for web apps)

### Step 2: Configure Custom Attributes

1. In your User Pool, go to **User pool properties** → **Attributes**
2. Add custom attribute:
    - Name: `role`
    - Type: `String`
    - Value: `user` (default)

### Step 3: Create Admin User

1. Go to **Users** tab in your User Pool
2. Click **Create user**
3. Set username, email, and temporary password
4. After user is created, edit user attributes:
    - Set `custom:role` to `admin`

### Step 4: Update Environment Variables

Copy your User Pool details and update `.env.local`:

```bash
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your_user_pool_id_here
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=your_user_pool_client_id_here
```

### Step 5: Test the Application

1. Start the development server: `npm run dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Test user registration and email verification
4. Test password reset functionality
5. Test different user roles

## User Role Permissions

### Public Users (Not logged in)

-   ✅ View product catalog
-   ✅ View product details
-   ❌ Add to cart
-   ❌ Purchase products
-   ❌ View orders

### Regular Users

-   ✅ All public user permissions
-   ✅ Add products to cart
-   ✅ Checkout and purchase
-   ✅ View order history
-   ✅ Manage profile
-   ❌ Admin functions

### Admin Users

-   ✅ All regular user permissions
-   ✅ Manage products (add, edit, delete)
-   ✅ View user management
-   ✅ View analytics and reports
-   ✅ Full administrative access

## Technology Stack

-   **Frontend**: Next.js 15 with App Router
-   **Styling**: TailwindCSS + Shadcn UI components
-   **Authentication**: AWS Amplify + Amazon Cognito
-   **Language**: TypeScript
-   **State Management**: React Context API
-   **Notifications**: Sonner (toast notifications)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
