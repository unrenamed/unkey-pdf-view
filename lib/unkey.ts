import { Unkey, verifyKey } from "@unkey/api";

export type ApiKeyValidationResult =
  | { status: "valid_key" }
  | { status: "invalid_key" }
  | { status: "expired_key" }
  | { status: "rate_limit_exceeded" }
  | { status: "api_error"; error: string }
  | { status: "unknown_error"; error: string };

export const unkey = new Unkey({
  rootKey: process.env.UNKEY_ROOT_KEY,
});

export const validateApiKey = async (
  key: string
): Promise<ApiKeyValidationResult> => {
  try {
    const { result, error } = await verifyKey(key);

    if (error) {
      return { status: "api_error", error: error.message };
    }

    if (result.code === "EXPIRED") {
      return { status: "expired_key" };
    } else if (result.code === "RATE_LIMITED") {
      return { status: "rate_limit_exceeded" };
    }

    if (result.valid) {
      return { status: "valid_key" };
    }

    return { status: "invalid_key" };
  } catch (error) {
    return {
      status: "unknown_error",
      error: "An error occurred while validating the API key.",
    };
  }
};
