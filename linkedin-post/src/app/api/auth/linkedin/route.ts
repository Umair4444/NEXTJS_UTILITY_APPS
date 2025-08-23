import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  console.log(">>>", clientId);
  const redirectUri =
    process.env.LINKEDIN_REDIRECT_URI ||
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: "LinkedIn client ID not configured" },
      { status: 500 }
    );
  }

  const scope = "openid profile email w_member_social";
  const state = Math.random().toString(36).substring(7);

  const authUrl =
    `https://www.linkedin.com/oauth/v2/authorization?` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `state=${state}&` +
    `scope=${encodeURIComponent(scope)}`;

  return NextResponse.redirect(authUrl);
}
