import { Amplify } from "aws-amplify";

const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
            userPoolClientId:
                process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
            region: "us-east-1",
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
