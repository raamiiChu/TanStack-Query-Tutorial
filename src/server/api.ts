import "server-only";
import { z } from "zod";

const MAX_DELAY_MS = 10_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

type Handler<Context> = (
  request: Request,
  context: Context
) => Promise<Response>;

/**
 * Wraps a route handler with:
 * - `?delay=<ms>` and `?fail=<0..1>` so the demo site can simulate a slow or flaky network
 * - consistent JSON error responses (400 for invalid input, HttpError status otherwise)
 */
export const withApi =
  <Context>(handler: Handler<Context>): Handler<Context> =>
  async (request, context) => {
    const { searchParams } = new URL(request.url);
    const delay = Math.min(
      Number(searchParams.get("delay")) || 0,
      MAX_DELAY_MS
    );
    const failRate = Number(searchParams.get("fail")) || 0;

    if (delay > 0) await sleep(delay);
    if (Math.random() < failRate) {
      return Response.json(
        { message: "Simulated server error" },
        { status: 500 }
      );
    }

    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { message: "Invalid request", issues: error.issues },
          { status: 400 }
        );
      }
      if (error instanceof HttpError) {
        return Response.json(
          { message: error.message },
          { status: error.status }
        );
      }
      throw error;
    }
  };

export const idParamSchema = z.coerce.number().int().positive();
