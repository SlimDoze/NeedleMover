// // lib/AuthGuard.tsx
// import React, { useEffect } from 'react';
// import { View, ActivityIndicator } from 'react-native';
// import { useRouter, useSegments } from 'expo-router';
// import { useAuth } from './LIB_AuthContext';
// import { AppColors } from '@/constants/AppColors';

// export function AuthGuard({ children }: { children: React.ReactNode }) {
//   const { user, loading } = useAuth();
//   const segments = useSegments();
//   const router = useRouter();

//   useEffect(() => {
//     if (loading) return;

//     // Define which routes are public
//     const isPublicRoute = 
//       segments[0] === '(auth)' || // Auth routes
//       segments.join('/') === 'index'; // Root index route
    
//     // Define which routes require authentication
//     const isProtectedRoute = segments[0] === '(teams)';

//     if (!user && isProtectedRoute) {
//       // Redirect to login if not logged in and trying to access protected route
//       router.replace('/');
//     } else if (user && segments[0] === '(auth)') {
//       // Redirect to teams if logged in and trying to access auth routes
//       router.replace('../(teams)/selection');
//     }
//   }, [user, loading, segments]);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color={AppColors.primary} />
//       </View>
//     );
//   }

//   return <>{children}</>;
// }
export default function DummyComponent() { return null; }