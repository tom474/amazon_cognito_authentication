# 🧪 Testing Guide - Amazon Cognito Authentication Application

This guide provides step-by-step test cases that validate each requirement of the task.

## 🚀 Prerequisites

1. **Start the application**:
    ```bash
    npm run dev
    ```
2. **Access the app**: http://localhost:3000 (or the port shown in terminal)
3. **Have AWS Cognito Console open**: [AWS Cognito Console](https://console.aws.amazon.com/cognito/)

---

## 📋 **REQUIREMENT 1: Three Types of Access (2 marks)**

### **Test Case 1.1: Public User Access (No Login)**

**Objective**: Verify public users can access basic features without authentication

**Steps**:

1. Open http://localhost:3000 in **incognito/private browser**
2. **Verify Navigation**: Should see "Sign In" and "Sign Up" buttons
3. **Test Public Access**:
    - ✅ Click "All Products" → Should access `/products`
    - ✅ Click "Phones" → Should access `/products/phones`
    - ✅ Click "Tablets" → Should access `/products/tablets`
    - ✅ Click "Laptops" → Should access `/products/laptops`
    - ✅ Click any product → Should access `/products/[id]`

**Expected Results**:

-   ✅ Can browse all products and view details
-   ❌ NO "Add to Cart" buttons visible
-   ❌ NO user menu dropdown
-   ❌ Cannot access `/cart`, `/orders`, `/profile`, or `/admin/*`

**Validation**: Public users have read-only access to product catalog

---

### **Test Case 1.2: Regular User Access (Public + Extra Functions)**

**Objective**: Verify regular users have all public features plus additional user-specific functions

**Prerequisites**: Create a regular user account first (see Test Case 2.1)

**Steps**:

1. **Sign in** as a regular user
2. **Verify Enhanced Navigation**: Should see user dropdown menu
3. **Test Regular User Features**:
    - ✅ Browse products (inherited from public)
    - ✅ Click "Add to Cart" on any product → Should work
    - ✅ Click cart icon → Should access `/cart` page
    - ✅ User menu → "Profile" → Should access `/profile`
    - ✅ User menu → "Orders" → Should access `/orders`

**Test Access Restrictions**:

-   ❌ Try to access `/admin` → Should show "Access Denied"
-   ❌ Try to access `/admin/products` → Should show "Access Denied"
-   ❌ Should NOT see admin menu items

**Expected Results**:

-   ✅ All public functions work
-   ✅ Can add items to cart and checkout
-   ✅ Can view profile and order history
-   ❌ Cannot access admin functions

**Validation**: Regular users = Public access + Shopping + Profile management

---

### **Test Case 1.3: Admin User Access (Regular + Admin Functions)**

**Objective**: Verify admin users have all regular user features plus admin-specific functions

**Prerequisites**:

1. Create a user account
2. Assign admin role (see "How to Create Admin User" section below)

**Steps**:

1. **Sign in** as admin user
2. **Verify Admin Navigation**: Should see additional admin menu items
3. **Test Admin Features**:
    - ✅ All regular user functions should work
    - ✅ User menu → "Admin Dashboard" → Should access `/admin`
    - ✅ Admin menu → "Manage Products" → Should access `/admin/products`
    - ✅ Admin menu → "Manage Users" → Should access `/admin/users`
    - ✅ Admin menu → "Manage Orders" → Should access `/admin/orders`

**Test Admin Functions**:

-   ✅ In `/admin/products`: Can see product management interface
-   ✅ In `/admin/users`: Can see user management interface
-   ✅ In `/admin/orders`: Can see order management interface
-   ✅ In `/admin`: Can see analytics dashboard

**Expected Results**:

-   ✅ All regular user functions work
-   ✅ Additional admin menu items visible
-   ✅ Can access all admin pages
-   ✅ Can see admin-specific data and controls

**Validation**: Admin users = Regular user access + Administrative functions

---

## 🔐 **REQUIREMENT 2: Login Features (2 marks)**

### **Test Case 2.1: User Registration**

**Objective**: Verify users can register their own accounts

**Steps**:

1. Go to http://localhost:3000
2. Click "Create Account" or "Sign Up"
3. **Fill Registration Form**:
    - Email: `test@example.com`
    - Username: `testuser`
    - Password: `TestPass123!` (meets complexity requirements)
    - Confirm Password: `TestPass123!`
4. Click "Create Account"

**Expected Results**:

-   ✅ Form accepts valid data
-   ✅ Success message: "Account created! Please check your email for verification code."
-   ✅ Page shows verification code input form
-   ✅ Check email for verification code

**Validation**: Users can successfully register accounts

---

### **Test Case 2.2: Registration Email Verification**

**Objective**: Verify email verification is required and functional

**Prerequisites**: Complete Test Case 2.1

**Steps**:

1. **Check your email** for verification code from AWS Cognito
2. **Enter the 6-digit code** in the verification form
3. Click "Verify Email"

**Expected Results**:

-   ✅ Verification code accepted
-   ✅ Success message: "Email verified successfully! You can now sign in."
-   ✅ Redirected to sign-in page
-   ✅ Cannot sign in without email verification

**Test Invalid Verification**:

-   Enter wrong code → Should show error message
-   Try to sign in before verification → Should show verification required message

**Validation**: Email verification is mandatory and functional

---

### **Test Case 2.3: Forgotten Password Reset**

**Objective**: Verify password reset functionality works

**Prerequisites**: Have a verified user account

**Steps**:

1. Go to sign-in page: `/auth/signin`
2. Click "Forgot Password?" link
3. **Enter your email** address
4. Click "Send Reset Code"
5. **Check email** for password reset code
6. **Enter reset code** and **new password**
7. Click "Reset Password"
8. **Try signing in** with new password

**Expected Results**:

-   ✅ Reset code sent to email
-   ✅ Code accepted and password updated
-   ✅ Can sign in with new password
-   ✅ Old password no longer works

**Validation**: Password reset is fully functional

---

### **Test Case 2.4: MFA (Multi-Factor Authentication)**

**Objective**: Verify MFA is enabled and configurable

**Check MFA Configuration**:

1. **Go to AWS Cognito Console**
2. Navigate to your User Pool → Sign-in → Multi-factor authentication
3. **Verify MFA Settings**:
    - ✅ Should see MFA options: "Optional" or "Required"
    - ✅ Should see MFA methods: Authenticator apps, SMS, Email

**Test MFA (if enabled)**:

1. Sign in to your application
2. If MFA is required, you should see additional verification step
3. Complete MFA verification

**Expected Results**:

-   ✅ MFA is configured in AWS Cognito
-   ✅ MFA methods are available (SMS/Email/Authenticator)
-   ✅ If required, MFA prompts during sign-in

**Validation**: MFA is enabled and functional in AWS Cognito

---

## 🛠️ **How to Create Admin User**

### **Method 1: Using AWS Cognito Console**

1. Go to [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
2. Select your User Pool: `us-east-1_vPj8LyrMQ`
3. Go to "Users" tab
4. Find your user
5. Click on the user → "Groups" tab
6. Click "Add user to group"
7. Select "admin" group → Add

### **Method 2: Using Custom Attributes**

1. Go to your user in Cognito Console
2. Click "Edit attributes"
3. Add custom attribute: `custom:role` = `admin`
4. Save changes

---

## 🏆 **Complete Test Checklist**

### **Requirement 1: Three Access Levels**

-   [ ] **Public User**: Can browse, view products (no cart/profile)
-   [ ] **Regular User**: Public + Cart + Orders + Profile (no admin)
-   [ ] **Admin User**: Regular + Product Management + User Management + Analytics

### **Requirement 2: Authentication Features**

-   [ ] **Registration**: Can create new accounts
-   [ ] **Email Verification**: Required and functional
-   [ ] **Password Reset**: Can reset forgotten passwords
-   [ ] **MFA**: Enabled in AWS Cognito configuration

### **Additional Validations**

-   [ ] **Role-based Navigation**: Menus change based on user role
-   [ ] **Access Control**: Protected routes block unauthorized access
-   [ ] **Error Handling**: Proper error messages for invalid actions
-   [ ] **User Experience**: Smooth transitions between authenticated states

---

## 🎯 **Expected Test Results Summary**

| Test Case          | Expected Outcome                     | Pass Criteria                     |
| ------------------ | ------------------------------------ | --------------------------------- |
| Public Access      | Browse products only                 | No cart/profile features          |
| Regular User       | Public + cart/orders/profile         | No admin features                 |
| Admin User         | Regular + admin dashboard/management | All features accessible           |
| Registration       | Account creation                     | Success message + email sent      |
| Email Verification | Account activation                   | Cannot login without verification |
| Password Reset     | New password works                   | Email reset flow functional       |
| MFA                | Additional security                  | Configured in AWS Cognito         |

**🎉 All tests passing = Full requirement compliance (4/4 marks)**
