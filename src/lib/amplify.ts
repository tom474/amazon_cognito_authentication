import { Amplify } from "aws-amplify";

const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID!,
            userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID!,
            region: process.env.NEXT_PUBLIC_AWS_REGION! || "us-east-1",
            signUpVerificationMethod: "code" as const,
            passwordFormat: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireNumbers: true,
                requireSpecialCharacters: true,
            },
        },
    },
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;
