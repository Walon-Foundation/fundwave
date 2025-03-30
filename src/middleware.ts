import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export  async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  console.log(token)
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  try {
    const decoded = jwtDecode(token) as { id:string, roles:string, iscampaign:boolean};

    const { roles, iscampaign } = decoded;
    console.log(roles);
    console.log(iscampaign)
    const pathname = req.nextUrl.pathname;

    // Role-based access control
    const adminRoutes = ["/admin/dashboard","/profile"];
    const userRoutes = ["/profile", "/dashboard"];
    const createPage = ['/campaign/create']

    if (roles === "Admin" && adminRoutes.includes(pathname)) {
      return NextResponse.next();
    } else if (roles === "User" && userRoutes.includes(pathname)) {
      return NextResponse.next();
    } else if (roles === "User" && iscampaign && createPage.includes(pathname) ){
        return NextResponse.next()
    }
     else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/dashboard", "/profile", "/campaign/create", "/dashboard"],
};
