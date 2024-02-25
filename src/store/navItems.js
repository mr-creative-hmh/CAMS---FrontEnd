import { defineStore } from 'pinia'

export const navItems = defineStore('navItems', {
  state: () => ({
    AdminNav:
      [
      { label: "Dashboard", route: "/admin", icon: "mdi-view-dashboard" },
      { label: "Users Management", route: "/admin/users", icon: "mdi-account-group" },
      { label: "Roles Management", route: "/admin/roles", icon: "mdi-account-key" },
      { label: "Categories Management", route: "/admin/categories", icon: "mdi-order-bool-descending" },
      { label: "Specializations Management", route: "/admin/specializations", icon: "mdi-hospital-box-outline" },
      { label: "Clinics Management", route: "/admin/clinics", icon: "mdi-hospital-building" },
      { label: "Doctors Schedules Management", route: "/admin/doctorschedules", icon: "mdi-calendar-clock" },
      { label: "Appointments Management", route: "/admin/appointments", icon: "mdi-calendar-check" },
      { label: "Medical Records Management", route: "/admin/medicalrecords", icon: "mdi-clipboard-pulse" }
      ],
    ClinicManNav: [
      { label: "Dashboard", route: "/clinicmanager", icon: "mdi-view-dashboard" },
      { label: "Today Appointments", route: "/clinicmanager/clinictodayappointments", icon: "mdi-calendar-today" },
      { label: "Appointments Management", route: "/clinicmanager/clinicappointmentsmanagement", icon: "mdi-calendar-clock" },
      { label: "Doctors Schedules Management", route: "/clinicmanager/clinicdoctorschedulesManagement", icon: "mdi-clipboard-text-clock" },
      { label: "Patients Management", route: "/clinicmanager/clinicpatientsmanagement", icon: "mdi-account-injury" },
      { label: "Doctors Management", route: "/clinicmanager/clinicdoctorsmanagement", icon: "mdi-doctor" }
      ],
    DoctorNav: [
      { label: "Dashboard", route: "/doctor", icon: "mdi-view-dashboard" },
      { label: "Today Appointments", route: "/doctor/doctortodayappointments", icon: "mdi-calendar-clock" },
      { label: "My Patients", route: "/doctor/doctorpatients", icon: "mdi-account-injury" }
      ],
    PatientNav: [
      { label: "Book Appointment", route: "/patient/patientAppointmentbook", icon: "mdi-calendar-plus" },
      { label: "My Appointments", route: "/patient/patientappointments", icon: "mdi-calendar" },
      { label: "My Medical Records", route: "/patient/patientmedicalrecords", icon: "mdi-clipboard-pulse" }
      ],

  }),
  actions: {

  }
})

