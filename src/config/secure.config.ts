// Prevent values from being logged
const createSecureValue = (value: string | undefined) => {
  let secureValue = value;
  Object.defineProperty(secureValue, 'toString', {
    value: () => '[Secure Value]',
    enumerable: false,
  });
  return secureValue;
};

export const secureConfig = {
  aws: {
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    userPoolId: createSecureValue(process.env.REACT_APP_USER_POOL_ID),
    userPoolWebClientId: createSecureValue(process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID),
    identityPoolId: createSecureValue(process.env.REACT_APP_IDENTITY_POOL_ID)
  },
  api: {
    endpoint: createSecureValue(process.env.REACT_APP_API_ENDPOINT),
    stage: process.env.REACT_APP_STAGE || 'dev'
  }
};

// Prevent object from being logged
Object.defineProperty(secureConfig, 'toString', {
  value: () => '[Secure Configuration]',
  enumerable: false,
});

Object.freeze(secureConfig); 