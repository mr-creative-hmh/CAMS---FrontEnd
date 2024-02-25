// Composables
import { useAuth } from '@/store/useAuthentication';
import { useUser } from '@/store/useUser';
import { authGuard } from '@/config/authGuard.js';
import { createRouter, createWebHistory } from 'vue-router'

// Layout Components
import Layout from '@/layout/DefaultPage.vue';
import UserLayout from '@/layout/UserPage.vue'

// Guest Views
import Home from '@/views/Common/HomePage.vue';
import Login from '@/views/Auth/LogIn.vue';
import RegisterUser from '@/views/Auth/RegisterUser.vue';
import UserProfile from '@/views/Auth/UserProfile.vue'
import AboutApp from '@/views/Common/AboutApp.vue'
import DoctorSchedules from '@/views/Common/DoctorSchedules.vue';

// Admin Views
import AdminDashboard from '@/views/Admin/AdminDash.vue';
import UsersManagement from '@/views/Admin/UsersManagement.vue'
import RolesManagement from '@/views/Admin/RolesManagement.vue';
import CategoriesManagement from '@/views/Admin/CategoriesManagement.vue'
import SpecializationsManagement from '@/views/Admin/SpecializationsManagement.vue'
import ClinicsManagement from '@/views/Admin/ClinicsManagement.vue'
import DoctorSchedulesManagement from '@/views/Admin/DoctorSchedulesManagement.vue'
import AppointmentsManagement from '@/views/Admin/AppointmentsManagement.vue'
import MedicalRecordsManagement from '@/views/Admin/MedicalRecordsManagement.vue'

// Clinic Manager Views
import ClinicManagerDashboard from '@/views/ClinicManager/ClinicmanDash.vue';
import ClinicdoctorsManagement from '@/views/ClinicManager/ClinicdoctorsManagement.vue'
import ClinicpatientsManagement from '@/views/ClinicManager/ClinicpatientsManagement.vue'
import ClinictodayAppointments from '@/views/ClinicManager/ClinictodayAppointments.vue'
import ClinicappointmentsManagement from '@/views/ClinicManager/ClinicappointmentsManagement.vue'
import ClinicdoctorschedulesManagement from '@/views/ClinicManager/ClinicdoctorschedulesManagement.vue'

// Doctor Views
import DoctorDashboard from '@/views/Doctor/DoctorDash.vue';
import DoctorTodayappointments from '@/views/Doctor/DoctorTodayappointments.vue'
import DoctorPatients from '@/views/Doctor/DoctorPatients.vue';

// Patient Views
import PatientDashboard from '@/views/Patient/PatientDash.vue';
import PatientAppointments from '@/views/Patient/PatientAppointments.vue';
import PatientMedicalrecords from '@/views/Patient/PatientMedicalrecords.vue';
import PatientAppointmentbook from '@/views/Patient/PatientAppointmentbook.vue';

const adminRoutes = [
  {
    path: '/admin',
    component: UserLayout,
    meta: { requiresAuth: true, role: 'Admin' },
    children:[
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard,
      },
      {
        path: 'users',
        name: 'UsersManagement',
        component: UsersManagement,
      },
      {
        path: 'roles',
        name: 'RolesManagement',
        component: RolesManagement,
      },
      {
        path: 'categories',
        name: 'CategoriesManagement',
        component: CategoriesManagement,
      },
      {
        path: 'specializations',
        name: 'SpecializationsManagement',
        component: SpecializationsManagement,
      },
      {
        path: 'clinics',
        name: 'ClinicsManagement',
        component: ClinicsManagement,
      },
      {
        path: 'doctorschedules',
        name: 'DoctorSchedulesManagement',
        component: DoctorSchedulesManagement,
      },
      {
        path: 'appointments',
        name: 'AppointmentsManagement',
        component: AppointmentsManagement,
      },
      {
        path: 'medicalrecords',
        name: 'MedicalRecordsManagement',
        component: MedicalRecordsManagement,
      },
      {
        path: 'userprofile',
        name: 'AdminUserProfile',
        component: UserProfile,
      },


      // Add more admin-specific routes
    ]
  }
];

const clinicManagerRoutes = [
  {
    path: '/clinicmanager',
    component: UserLayout,
    meta: { requiresAuth: true, role: 'Clinic Manager' },
    children: [
      {
        path: '',
        name: 'ClinicManagerDashboard',
        component: ClinicManagerDashboard,
      },
      {
        path: 'clinictodayappointments',
        name: 'ClinictodayAppointments',
        component: ClinictodayAppointments,
      },
      {
        path: 'clinicappointmentsmanagement',
        name: 'ClinicappointmentsManagement',
        component: ClinicappointmentsManagement,
      },
      {
        path: 'clinicpatientsmanagement',
        name: 'ClinicpatientsManagement',
        component: ClinicpatientsManagement,
      },
      {
        path: 'clinicdoctorsmanagement',
        name: 'ClinicdoctorsManagement',
        component: ClinicdoctorsManagement,
      },
      {
        path: 'clinicdoctorschedulesManagement',
        name: 'ClinicdoctorschedulesManagement',
        component: ClinicdoctorschedulesManagement,
      },
      {
        path: 'userprofile',
        name: 'ClinicManagerUserProfile',
        component: UserProfile,
      },

      // Add more clinic manager-specific routes
    ]
  }
];

const doctorRoutes = [
  {
    path: '/doctor',
    component: UserLayout,
    meta: { requiresAuth: true, role: 'Doctor' },
    children:[
      {
        path: '',
        name: 'DoctorDashboard',
        component: DoctorDashboard,
      },
      {
        path: 'doctortodayappointments',
        name: 'DoctorTodayappointments',
        component: DoctorTodayappointments,
      },
      {
        path: 'doctorpatients',
        name: 'DoctorPatients',
        component: DoctorPatients,
      },
      {
        path: 'userprofile',
        name: 'DoctorUserProfile',
        component: UserProfile,
      },

      // Add more doctor-specific routes
    ]
  }
];

const patientRoutes = [
  {
    path: '/patient',
    component: UserLayout,
    meta: { requiresAuth: true, role: 'Patient' },
    children:[
      {
        path: '',
        name: 'PatientDashboard',
        component: PatientDashboard,
      },
      {
        path: 'patientAppointmentbook',
        name: 'PatientAppointmentbook',
        component: PatientAppointmentbook,
      },
      {
        path: 'patientappointments',
        name: 'PatientAppointments',
        component: PatientAppointments,
      },
      {
        path: 'patientmedicalrecords',
        name: 'PatientMedicalrecords',
        component: PatientMedicalrecords,
      },
      {
        path: 'userprofile',
        name: 'PatientUserProfile',
        component: UserProfile,
      },
      // Add more patient-specific routes
    ]
  }
];

const routes = [
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      {
        path: 'login',
        name: 'Login',
        component: Login,
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterUser,
      },
      {
        path: 'about',
        name: 'About',
        component: AboutApp,
      },
      {
        path: '/doctorschedules',
        name: 'DoctorSchedules',
        component: DoctorSchedules,
      },

    ],
  },
  ...adminRoutes,
  ...clinicManagerRoutes,
  ...doctorRoutes,
  ...patientRoutes,
  // Catch-all route to redirect to home if the route doesn't match any
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export function getAllowedRoutesForRole(role) {
  let routes;
  switch (role) {
    case 'Admin':
      routes = adminRoutes;
      break;
    case 'Doctor':
      routes = doctorRoutes;
      break;
    case 'Clinic Manager':
      routes = clinicManagerRoutes;
      break;
    case 'Patient':
      routes = patientRoutes;
      break;
    default:
      return [];
  }

  // Get paths of both parent and child routes
  return routes.flatMap(route => [
    route.path,
    ...route.children.map(child => `${route.path}/${child.path}`)
  ]);
}



router.beforeEach((to, from, next) => {
  const authStore = useAuth();
  const userStore = useUser();
  authGuard(to, from, next, authStore, userStore);
});

export default router
