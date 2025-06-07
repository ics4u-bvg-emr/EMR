import { ref, computed } from 'vue'

export function usePatientUpdates(patients, medicalRecords) {
    const updates = computed(() => {
        const list = []

        patients.value.forEach(patient => {
        const updatedAt = new Date(patient.updatedAt || Date.now())
        const name = `${patient.firstName} ${patient.lastName}`

        if (patient.medicalHistory?.allergies?.length) {
            list.push({
            id: `allergies-${patient._id}`,
            patientId: patient._id,
            patientName: name,
            updatedAt,
            type: 'Patient Info',
            updateName: 'Updated Allergies',
            details: patient.medicalHistory.allergies.join(', ')
            })
        }

        if (patient.weight != null) {
            list.push({
            id: `weight-${patient._id}`,
            patientId: patient._id,
            patientName: name,
            updatedAt,
            type: 'Patient Info',
            updateName: 'Updated Weight',
            details: `Weight: ${patient.weight} kg`
            })
        }

        if (patient.height != null) {
            list.push({
            id: `height-${patient._id}`,
            patientId: patient._id,
            patientName: name,
            updatedAt,
            type: 'Patient Info',
            updateName: 'Updated Height',
            details: `Height: ${patient.height} cm`
            })
        }
        })

        medicalRecords.value.forEach(record => {
        list.push({
            id: `record-${record._id}`,
            patientId: record.patientId,
            patientName: getPatientName(record.patientId),
            updatedAt: new Date(record.updatedAt || record.date),
            type: 'Medical Record',
            updateName: record.updateName || record.title || 'Medical Update',
            details: record.description || ''
        })
        })

        return list.sort((a, b) => b.updatedAt - a.updatedAt)
    })

    function getPatientName(id) {
        const p = patients.value.find(p => p._id === id)
        return p ? `${p.firstName} ${p.lastName}` : 'Unknown'
    }

    const recentUpdates = computed(() => updates.value.slice(0, 5))


    return {
        updates,
        recentUpdates,
    }
}
