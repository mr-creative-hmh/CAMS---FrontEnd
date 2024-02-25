
// Import your Pinia stores
import { getAllowedRoutesForRole } from '@/router';

export function authGuard(to, from, next, authStore, userStore) {
  const isAuthenticated = authStore.isAuthenticated;
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !isAuthenticated) {
    next({ path: '/login' }); // Redirect to login page if route requires authentication but user is not authenticated
  } else {
    // Check if the user is authenticated and get their role
    if (isAuthenticated) {
      const userRole = userStore.Role;
      console.log("From Path:", from.path);
      const allowedRoutes = getAllowedRoutesForRole(userRole);
      console.log('allowedRoutes :', allowedRoutes);
      console.log("To Path:", to.path);
      console.log('allowedRoutes To:', allowedRoutes.includes(to.path));
      // Check if the user is trying to access a route that matches their role
      if (allowedRoutes.includes(to.path)) {
        next(); // Proceed to the route if it matches the user's role
      } else {
        // Redirect the user to their respective dashboard based on their role
        switch (userRole) {
          case 'Admin':
            next('/admin');
            break;
          case 'Clinic Manager':
            next('/clinicmanager');
            break;
          case 'Doctor':
            next('/doctor');
            break;
          case 'Patient':
            next('/patient');
            break;
          default:
            next(); // Proceed to the route if user role is not defined or invalid
        }
      }
    } else {
      next(); // Proceed to the route if authentication is not required
    }
  }
}
