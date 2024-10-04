import { NextRequest, NextResponse } from "next/server";
import { unkey } from "@/lib/unkey";

export async function POST(req: NextRequest) {
  const { ownerId = "foo", guestId = "bar", oldKey } = await req.json();

  // Old key cleanup
  await unkey.keys.delete({ keyId: oldKey });

  // Create a new API key
  const created = await unkey.keys.create({
    apiId: process.env.UNKEY_EBOOK_API_ID,
    prefix: "ebook",
    byteLength: 16,
    ownerId,
    meta: { guestId },
    expires: Date.now() + 2 * 60 * 1000, // two minutes since now
    ratelimit: {
      duration: 3000,
      limit: 5,
    },
    enabled: true,
  });

  if (created.error) {
    return NextResponse.json(
      { message: created.error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ apiKey: created.result.key });
}
