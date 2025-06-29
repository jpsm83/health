import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomTokenPayload extends JwtPayload {
  UserInfo: {
    username: string;
    roles: string[];
  };
}

export function verifyJWT(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as CustomTokenPayload;

    // You can return decoded user info for use in your route
    return decoded;
  } catch (error) {
    return NextResponse.json(
      { message: "Forbidden: " + error },
      { status: 403 }
    );
  }
}
