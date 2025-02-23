import { runCorsProxy } from "./run";
import { cleanUpCorsProxy } from "./cleanup";

export const corsProxy = {
  run: runCorsProxy,
  cleanUp: cleanUpCorsProxy,
};
