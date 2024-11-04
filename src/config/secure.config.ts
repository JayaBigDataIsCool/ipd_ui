// This file should be added to .gitignore and values should be set via environment variables
export const secureConfig = {
    aws: {
        region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
        identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID
    },
    api: {
        endpoint: process.env.REACT_APP_API_ENDPOINT,
        stage: process.env.REACT_APP_STAGE || 'dev'
    }
}; 