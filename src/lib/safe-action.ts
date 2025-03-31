import { createServerActionProcedure } from "zsa";
import { PublicError } from "./errors";
import { rateLimitByKey } from "./limiter";
import { assertAuthenticated } from "./session";

function shapeErrors({ err }: any) {
  const isAllowedError = err instanceof PublicError;
  const isDev = process.env.NODE_ENV === "development";
  if (isAllowedError || isDev) {
    console.error(err);
    return {
      code: err.code ?? "ERROR",
      message: `${!isAllowedError && isDev ? "DEV ONLY ENABLED - " : ""}${
        err.message
      }`,
    };
  } else {
    return {
      code: "ERROR",
      message: "Something went wrong",
    };
  }
}


export const authenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
    const user = await assertAuthenticated();

    await rateLimitByKey({
      key: `${user.id}-global`, 
      limit: 5000,
      window: 10000,
    });

    return { user };
  });

export const unauthenticatedAction = createServerActionProcedure()
  .experimental_shapeError(shapeErrors)
  .handler(async () => {
      await rateLimitByKey({
        key: `unauthenticated-global`,
        limit: 5000,
        window: 10000,
      });
  });