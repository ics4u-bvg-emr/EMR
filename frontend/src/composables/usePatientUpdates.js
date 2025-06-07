import { ref, computed } from 'vue'

const lastPatientData = new Map()
const updates = ref([])

export function usePatientUpdates(patients, medicalRecords) {
    const loading = ref(false)
    const error = ref(null)

    async function fetchData() {
        console.log('\n[Fetch] Starting patient + record fetch...')
        loading.value = true
        error.value = null

        try {
        const [patientsRes, recordsRes] = await Promise.all([
            fetch('http://localhost:3000/api/patients'),
            fetch('http://localhost:3000/api/medical-records'),
        ])

        if (!patientsRes.ok || !recordsRes.ok) {
            throw new Error('Failed to fetch')
        }

        const newPatients = await patientsRes.json()
        const newRecords = await recordsRes.json()
        console.log(`[Fetch] Got ${newPatients.length} patients, ${newRecords.length} records`)

        newPatients.forEach(patient => {
            const prev = lastPatientData.get(patient._id)

            if (!prev) {
            console.log(`[Init] No previous snapshot for ${patient.firstName} ${patient.lastName}`)
            lastPatientData.set(patient._id, { ...patient })
            return
            }

            let changed = false

            if (prev.height !== patient.height) {
            changed = true
            console.log(`[Change] Height changed for ${patient.firstName}: ${prev.height} → ${patient.height}`)
            updates.value.push({
                id: `height-${patient._id}-${Date.now()}`,
                patientId: patient._id,
                patientName: `${patient.firstName} ${patient.lastName}`,
                type: 'Patient Info',
                updateName: 'Updated Height',
                details: `Height: ${patient.height} cm`,
                timestamp: new Date()
            })
            }

            if (prev.weight !== patient.weight) {
            changed = true
            console.log(`[Change] Weight changed for ${patient.firstName}: ${prev.weight} → ${patient.weight}`)
            updates.value.push({
                id: `weight-${patient._id}-${Date.now()}`,
                patientId: patient._id,
                patientName: `${patient.firstName} ${patient.lastName}`,
                type: 'Patient Info',
                updateName: 'Updated Weight',
                details: `Weight: ${patient.weight} kg`,
                timestamp: new Date()
            })
            }

            if (!changed) {
            console.log(`[No Change] ${patient.firstName} unchanged`)
            }

            lastPatientData.set(patient._id, { ...patient })
        })

        patients.value = newPatients

        newRecords.forEach(record => {
            if (!medicalRecords.value.some(r => r._id === record._id)) {
            console.log(`[Record] New record for ${record.patientId}: ${record.reason || 'no reason provided'}`)
            medicalRecords.value.push(record)
            } else {
            console.log(`[Record] Record ${record._id} already exists, skipping`)
            }
        })

        } catch (err) {
        error.value = 'Error loading updates: ' + err.message
        console.error('[Error]', err.message)
        } finally {
        loading.value = false
        }
    }

    const sortedUpdates = computed(() =>
        [...updates.value].sort((a, b) => b.timestamp - a.timestamp)
    )

    // ✅ Trigger fetch immediately so updates work
    fetchData()

    return {
        updates: sortedUpdates,
        fetchData,
        loading,
        error,
    }
}
