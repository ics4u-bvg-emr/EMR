import { defineStore } from 'pinia'
import axios from 'axios'

export const useDiagnosisStore = defineStore('diagnosis', {
  state: () => ({
    currentStep: 0,
    patientId: null,
    diagnosis: {
      symptoms: [],
      otherSymptom: '',
      examinationFields: {
        temperature: '',
        pulse: '',
        bp: '',
        resp: '',
        spo2: '',
        weight: '',
        height: '',
        waist: '',
        protein: '',
        dipstickGlucose: '',
        blood: '',
        bmi: '',
        ldl: '',
        hdl: '',
        triglycerides: '',
        protein: '',
        dipstickGlucose: '',
        blood: '',
        fastingGlucose: '',
        hba1c: '',
        other: ''
      },
      diagnosis: '',
      prescription: [],
      plan: '',
      status: 'draft'
    }
  }),
  actions: {
    setPatientId(id) {
      this.patientId = id
    },
    nextStep() {
      if (this.currentStep < 3) this.currentStep++
    },
    prevStep() {
      if (this.currentStep > 0) this.currentStep--
    },
    saveDraft() {
      this.diagnosis.status = 'draft'
    },
    completeDiagnosis() {
      this.diagnosis.status = 'completed'
    },
    loadDiagnosis(data) {
      this.diagnosis = { ...this.diagnosis, ...data }
    },
    async saveDraft() {
        try {
            const response = await axios.post(`https://emr-backend-h03z.onrender.com/api/patients/${this.patientId}/diagnosis`, {
                ...this.diagnosis,
                status: 'draft',
                doctorId: '6838adf12a17b3053d853cf7' // Get this from auth or user store
            });
            return response.data;
        } catch (error) {
            console.error('Error saving draft:', error);
            throw error;
        }
    },
    async completeDiagnosis() {
        try {
            const response = await axios.post(`https://emr-backend-h03z.onrender.com/api/patients/${this.patientId}/diagnosis`, {
                ...this.diagnosis,
                status: 'completed',
                doctorId: '6838adf12a17b3053d853cf7' // Change this
            });
            return response.data;
        } catch (error) {
            console.error('Error completing diagnosis:', error);
            throw error;
        }
    },
    async loadDiagnosis() {
        try {
            const response = await axios.get(`https://emr-backend-h03z.onrender.com/api/patients/${this.patientId}/diagnosis`);
            if (response.data) {
                this.diagnosis = response.data;
                // Convert prescription if stored as string
                if (typeof this.diagnosis.prescription === 'string') {
                this.diagnosis.prescription = JSON.parse(this.diagnosis.prescription);
                }
            }
            return response.data;
        } catch (error) {
            console.error('Error loading diagnosis:', error);
            throw error;
        }
    },
    async fetchDoctorDrafts(doctorId) {
      try {
        const response = await axios.get(`https://emr-backend-h03z.onrender.com/api/doctors/${doctorId}/diagnosis/drafts`)
        this.draftDiagnoses = response.data || []
        return response.data
      } catch (error) {
        console.error('Error fetching drafts:', error)
        this.draftDiagnoses = [] // Ensure it's always an array
        throw error
      }
    },
    async loadDraft(patientId) {
        try {
        const response = await axios.get(`https://emr-backend-h03z.onrender.com/api/patients/${patientId}/diagnosis`);
        if (response.data) {
            this.diagnosis = response.data;
            this.patientId = patientId;
            // Convert prescription if stored as string
            if (typeof this.diagnosis.prescription === 'string') {
                this.diagnosis.prescription = JSON.parse(this.diagnosis.prescription);
            }
        }
        return response.data;
        } catch (error) {
            console.error('Error loading draft:', error);
            throw error;
        }
    }
  }
})
