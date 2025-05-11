/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_AWS_ACCESS_KEY_ID: string;
    REACT_APP_AWS_SECRET_ACCESS_KEY: string;
    // You can add other environment variables here as well
  }
}
