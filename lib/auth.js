// // lib/auth.js - Server-side utilities
// import jwt from 'jsonwebtoken';
// import { cookies } from 'next/headers';

// export  async function getUserFromCookies() {
//   try {
//     const cookieStore = await cookies();
//      let token = cookieStore.get('accessToken')?.value;
//     if (token) {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       return decoded;
//     }
    
//     // Fallback to refresh token
//     token = cookieStore.get('refreshToken')?.value;
//     if (token) {
//       const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
//       return decoded;
//     }

//     console.log('Token:', token);
    
//     if (!token) return null;

  
    

    
//     // Try admin JWT secret first
//     try {
//       const decoded = jwt.verify(token, process.env.ADMIN_REFRESH_TOKEN_SECRET);
//       return decoded;
//     } catch {
//       // If admin JWT fails, try regular JWT secret
   
//       const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
//       return decoded;
//     }
//   } catch (error) {
//     console.error('Error getting user from cookies:', error);
//     return null;
//   }
// }

// export async function getUserIdFromCookies() {
//   const user = await getUserFromCookies();
//   console.log('User:', user);
//   console.log('User ID:', user?.id);
//   return user?.id || null;
// }

// lib/auth.js - Server-side utilities
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function getUserFromCookies() {
  try {
    const cookieStore = await cookies();
    
    // Try access token first (short-lived, more secure)
    let token = cookieStore.get('accessToken')?.value;
    if (token) {
      console.log('Found access token');
      
      // Try admin JWT secret first for access tokens
      try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        console.log('Decoded with admin secret:', decoded);
        return decoded;
      } catch {
        // If admin JWT fails, try regular JWT secret
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log('Decoded with regular secret:', decoded);
          return decoded;
        } catch (error) {
          console.log('Access token verification failed:', error.message);
        }
      }
    }
    
    // Fallback to refresh token if access token is not available or invalid
    token = cookieStore.get('refreshToken')?.value;
    console.log('Refresh token:', token ? 'Found' : 'Not found');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        console.log('Decoded refresh token:', decoded);
        return decoded;
      } catch (error) {
        console.log('Refresh token verification failed:', error.message);
      }
    }

    console.log('No valid token found');
    return null;

  } catch (error) {
    console.error('Error getting user from cookies:', error);
    return null;
  }
}

export async function getUserIdFromCookies() {
  const user = await getUserFromCookies();
  console.log('User:', user);
  console.log('User ID:', user?.id);
  return user?.id || null;
}

// Optional: Helper function to get user role
export async function getUserRoleFromCookies() {
  const user = await getUserFromCookies();
  return user?.role || null;
}

// Optional: Helper function to check if user is admin
export async function isAdminFromCookies() {
  const user = await getUserFromCookies();
  return user?.role === 'admin';
}