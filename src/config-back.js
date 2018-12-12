export default {
  s3: {
    REGION: "us-east-1",
    BUCKET: "freelanceruploads2",
    //BUCKET: "freelance-app-uploads"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://49ibvam0va.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_wRR9s216a",
    APP_CLIENT_ID: "3i3r0lkf3cha4tqv090j2dq5jl",
    IDENTITY_POOL_ID: "us-east-1:fea03007-9dfb-4689-991b-747a1b7fb1c1"
  },
  facebookAppId: "2200810566907729",
  googleAppId: "679345444938-bjpk976597lke4aveus0dvvo7h3qrrsg.apps.googleusercontent.com",
  awsAppId: "amzn1.application-oa2-client.278696a9f4714d7a898d7d1d4ffa4af4"
};

const dev = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "frelancer-test-2-api-dev-attachmentsbucket-z9skpleygwcv"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://yvwvxpsxrh.execute-api.us-east-1.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_U6vIhAmAo",
    APP_CLIENT_ID: "1st046so19rahfa92hck8h1m4f",
    IDENTITY_POOL_ID: "us-east-1:94e0a485-45bd-421d-92db-1041501e293c"
  },
  facebookAppId: "2200810566907729",
  googleAppId: "679345444938-bjpk976597lke4aveus0dvvo7h3qrrsg.apps.googleusercontent.com",
  awsAppId: "amzn1.application-oa2-client.278696a9f4714d7a898d7d1d4ffa4af4"
};

const prod = {
  s3: {
    REGION: "us-east-1",
    BUCKET: "frelancer-test-2-api-prod-attachmentsbucket-7xc0vgns9xv9"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://qtc4c0xt6f.execute-api.us-east-1.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_yEF46tDjc",
    APP_CLIENT_ID: "6q0074aspa38ptb9frhl7up88j",
    IDENTITY_POOL_ID: "us-east-1:e1b1bd81-1ab3-4185-a81b-6e99c22f6c88"
  },
  facebookAppId: "2200810566907729",
  googleAppId: "679345444938-bjpk976597lke4aveus0dvvo7h3qrrsg.apps.googleusercontent.com",
  awsAppId: "amzn1.application-oa2-client.278696a9f4714d7a898d7d1d4ffa4af4"
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};

