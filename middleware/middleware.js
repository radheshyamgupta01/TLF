// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request) {
//   // Add CORS headers for API routes
//   if (request.nextUrl.pathname.startsWith("/api/")) {
//     const response = NextResponse.next();

//     response.headers.set("Access-Control-Allow-Origin", "*");
//     response.headers.set(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//     );
//     response.headers.set(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization"
//     );

//     // Handle preflight requests
//     if (request.method === "OPTIONS") {
//       // Handle preflight requests
// if (request.method === "OPTIONS") {
//   return new NextResponse(null, { 
//     status: 200, 
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//     }
//   });
// }
//     }

//     return response;
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/api/:path*",
// };



import { NextRequest, NextResponse } from "next/server";
import cors from "cors";

export function middleware(request) { // Add request parameter
  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
 
    // Handle preflight requests first
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { 
        status: 200, 
        headers: {
          "Access-Control-Allow-Origin": "https://www.cpmarket.in",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
      });
    }

    const response = NextResponse.next();
    
    response.headers.set("Access-Control-Allow-Origin", "https://www.cpmarket.in",);
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
