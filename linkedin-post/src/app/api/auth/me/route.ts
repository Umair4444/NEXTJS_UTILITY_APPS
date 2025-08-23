import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userData = cookieStore.get("user_data");

    if (!userData) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json(JSON.parse(userData.value));
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 401 }
    );
  }
}
