/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

import { secureConfig } from './config/secure.config';
import { secureLogger } from './utils/secureLogger';

let awsExports: AwsExports;

try {
  awsExports = {
    aws_project_region: secureConfig.aws.region,
    aws_cognito_identity_pool_id: secureConfig.aws.identityPoolId,
    aws_cognito_region: secureConfig.aws.region,
    aws_user_pools_id: secureConfig.aws.userPoolId,
    aws_user_pools_web_client_id: secureConfig.aws.userPoolWebClientId,
    oauth: {},
    aws_cognito_username_attributes: ["EMAIL"],
    aws_cognito_social_providers: [],
    aws_cognito_signup_attributes: ["EMAIL"],
    aws_cognito_mfa_configuration: "OFF",
    aws_cognito_mfa_types: ["SMS"],
    aws_cognito_password_protection_settings: {
      passwordPolicyMinLength: 8,
      passwordPolicyCharacters: []
    },
    aws_cognito_verification_mechanisms: ["EMAIL"]
  };

  secureLogger.log('AWS configuration loaded successfully');
} catch (error) {
  secureLogger.error('Error in AWS configuration:', error);
  // Provide a fallback configuration
  awsExports = {
    aws_project_region: "us-east-1",
    aws_cognito_identity_pool_id: undefined,
    aws_cognito_region: "us-east-1",
    aws_user_pools_id: undefined,
    aws_user_pools_web_client_id: undefined,
    oauth: {},
    aws_cognito_username_attributes: ["EMAIL"],
    aws_cognito_social_providers: [],
    aws_cognito_signup_attributes: ["EMAIL"],
    aws_cognito_mfa_configuration: "OFF",
    aws_cognito_mfa_types: ["SMS"],
    aws_cognito_password_protection_settings: {
      passwordPolicyMinLength: 8,
      passwordPolicyCharacters: []
    },
    aws_cognito_verification_mechanisms: ["EMAIL"]
  };
}

// Prevent object from being logged
Object.defineProperty(awsExports, 'toString', {
  value: () => '[Secure AWS Configuration]',
  enumerable: false,
});

Object.freeze(awsExports);

export default awsExports;
