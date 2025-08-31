# 👨‍💼 Admin User Setup Guide

## 🔧 **How to Create Admin Users**

Since your Cognito User Pool doesn't have custom attributes configured, we need to use Groups to assign admin roles.

### **Method 1: Using AWS Cognito Console (Recommended)**

1. **Go to AWS Cognito Console**:

    - Open [AWS Cognito Console](https://console.aws.amazon.com/cognito/)
    - Select your User Pool: `us-east-1_vPj8LyrMQ`

2. **Find Your User**:

    - Go to "User management" → "Users"
    - Find the user you want to make admin
    - Click on the username

3. **Add to Admin Group**:
    - In the user details page, go to "Groups" tab
    - Click "Add user to group"
    - Select "admin" group
    - Click "Add"

### **Method 2: Update Code to Use Groups**

I need to update the code to check for group membership instead of custom attributes.

## 🔄 **Current Implementation Status**

-   ✅ Admin group exists in Cognito
-   ❌ Code checks custom:role (not available)
-   🔧 Need to update code to check group membership

## 🛠️ **Code Changes Needed**

The application currently checks for `custom:role` attribute, but we need to check group membership instead.
