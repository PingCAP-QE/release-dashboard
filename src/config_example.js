const dev_config = {
  // The URL of the server to use.
  SERVER_HOST: "[Your Backend Server URL]",
};

const prod_config = {
  // The URL of the server to use.
  SERVER_HOST: "/",
};

console.log(process.env);

export default process.env.NODE_ENV === "development"
  ? dev_config
  : prod_config;

export const GIT_CLIENT_ID = "[GIT_CLIENT_ID]";
export const GIT_CLIENT_SECRET = "[GIT_CLIENT_SECRET]";
