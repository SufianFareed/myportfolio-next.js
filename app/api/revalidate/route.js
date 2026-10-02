import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// WordPress calls this the moment a post is published or updated (see the
// functions.php snippet in the README), so the blog updates instantly
// instead of waiting for the 5-minute fallback cache to expire.
export async function POST(request) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: "REVALIDATE_SECRET is not set on the server." },
      { status: 500 }
    );
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret." }, { status: 401 });
  }

  revalidateTag("posts");
  return NextResponse.json({ revalidated: true, tag: "posts", time: Date.now() });
}
