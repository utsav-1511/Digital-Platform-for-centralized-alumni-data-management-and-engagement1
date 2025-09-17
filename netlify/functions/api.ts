import serverless from "serverless-http";

import { createServer } from "../../server";

let handler: any = null;

export const handlerWrapper = async (event: any, context: any) => {
  if (!handler) {
    const app = await createServer();
    handler = serverless(app);
  }
  return handler(event, context);
};

export { handlerWrapper as handler };
