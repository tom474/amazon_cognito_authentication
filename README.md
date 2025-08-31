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

## ✅ Your AWS Cognito Configuration (Completed)

Great! You've successfully completed the AWS Cognito setup. Here are your configuration details:

### **Cognito Configuration Details:**

-   **User Pool ID**: `us-east-1_vPj8LyrMQ`
-   **Web Client ID**: `30oqphrp2854vfknmk6hr1hjkh`
-   **Region**: `us-east-1`
-   **Cognito Domain**: `https://us-east-1vpj8lyrmq.auth.us-east-1.amazoncognito.com`
-   **Admin Group**: ✅ Created successfully

### **Steps Completed:**

-   ✅ **Step 1**: Amazon Cognito application and user pool created
-   ✅ **Step 2**: MFA and account recovery configured
-   ✅ **Step 3**: Authentication methods verified
-   ✅ **Step 4**: Admin user group created

### **How to Assign Admin Role:**

1. **Go to AWS Cognito Console** → Your User Pool
2. **Users tab** → Find the user you want to make admin
3. **Groups tab** → Add user to "admin" group
4. **Alternative method** - Edit user attributes:
    - Go to user details
    - Edit attributes
    - Add custom attribute: `custom:role` = `admin`

### **Test Your Authentication:**

1. **Run the development server**:

    ```bash
    npm run dev
    ```

2. **Open** [http://localhost:3000](http://localhost:3000)

3. **Test the flows**:
    - Sign up a new user → Email verification → Sign in
    - Test password reset functionality
    - Create an admin user and test admin features

### **Environment Variables (Already Configured):**

Your `.env.local` file is configured with:

```bash
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_USER_POOL_ID=us-east-1_vPj8LyrMQ
NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID=30oqphrp2854vfknmk6hr1hjkh
```

## Deploy on Vercel

1. **Push your code** to GitHub (✅ Already done)
2. **Go to** [Vercel.com](https://vercel.com) and import your repository
3. **Add Environment Variables** in Vercel project settings:
    ```bash
    NEXT_PUBLIC_AWS_REGION=us-east-1
    NEXT_PUBLIC_USER_POOL_ID=us-east-1_vPj8LyrMQ
    NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID=30oqphrp2854vfknmk6hr1hjkh
    ```
4. **Deploy** - Your app will be live!

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
