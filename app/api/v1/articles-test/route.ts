import { NextResponse } from "next/server";
import { checkAuthWithApiKey } from "@/lib/utils/apiKeyAuth";
import { auth } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const authError = checkAuthWithApiKey(req, session);
    
    if (authError) {
      return authError;
    }

    return NextResponse.json({ 
      message: "Articles GET with API key authentication working!",
      method: "GET",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Articles GET failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const authError = checkAuthWithApiKey(req, session);
    
    if (authError) {
      return authError;
    }

    return NextResponse.json({ 
      message: "Articles POST with API key authentication working!",
      method: "POST",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Articles POST failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
