export const API_GUEST = {
  PATIENT_REGISTER: "/guest/registerpatientuser",
  CLINICS_CATEGORIES: '/guest/clinics-categories',
  CATEGORY_CLINICS: (categoryId) => `/guest/clinics-categories/${categoryId}/clinics`,
  CLINIC_DOCTORS: (clinicId) => `/guest/clinics/${clinicId}/doctors`,
  DOCTOR_SCHEDULES: (doctorId, clinicId) => `/guest/doctors/${doctorId}/clinics/${clinicId}/schedules`
};
