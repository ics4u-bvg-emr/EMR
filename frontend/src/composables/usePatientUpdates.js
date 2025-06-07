import { ref, computed } from 'vue'

const SNAPSHOT_KEY = 'lastPatientSnapshots'
const UPDATES_KEY = 'patientUpdates'

const lastPatientData = new Map()
const updates = ref([])

export function usePatientUpdates(patients, medicalRecords) {
    const loading = ref(false)
    const error = ref(null)

    function loadFromCache() {
        try {
        const rawSnapshots = localStorage.getItem(SNAPSHOT_KEY)
        const rawUpdates = localStorage.getItem(UPDATES_KEY)

        if (rawSnapshots) {
            const parsed = JSON.parse(rawSnapshots)
            for (const id in parsed) lastPatientData.set(id, parsed[id])
            console.log('[Restore] Snapshots loaded')
        }

        if (rawUpdates) {
            updates.value = JSON.parse(rawUpdates).map(u => ({
            ...u,
            timestamp: new Date(u.timestamp) // revive Date
            }))
            console.log(`[Restore] ${updates.value.length} updates loaded`)
        }
        } catch (e) {
        console.warn('[Restore] Failed to load cache:', e)
        }
    }

    function saveToCache() {
        try {
        const snapshotObj = Object.fromEntries(lastPatientData.entries())
        localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshotObj))
        localStorage.setItem(UPDATES_KEY, JSON.stringify(updates.value))
        console.log('[Save] Cache saved')
        } catch (e) {
        console.warn('[Save] Failed to save cache:', e)
        }
    }

    loadFromCache()

    async function fetchData() {
        console.log('\n[Fetch] Fetching patient + record data...')
        loading.value = true
        error.value = null

        try {
        const [patientsRes, recordsRes] = await Promise.all([
            fetch('http://localhost:3000/api/patients'),
            fetch('http://localhost:3000/api/medical-records'),
        ])

        if (!patientsRes.ok || !recordsRes.ok) throw new Error('Failed to fetch')

        const newPatients = await patientsRes.json()
        const newRecords = await recordsRes.json()
        console.log(`[Fetch] ${newPatients.length} patients, ${newRecords.length} records`)

        newPatients.forEach(patient => {
            const prev = lastPatientData.get(patient._id)

            if (!prev) {
            console.log(`[Init] First time for ${patient.firstName}`)
            lastPatientData.set(patient._id, { ...patient })
            return
            }

            let changed = false

            if (prev.height !== patient.height) {
            changed = true
            console.log(`[Change] Height: ${prev.height} → ${patient.height}`)
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
            console.log(`[Change] Weight: ${prev.weight} → ${patient.weight}`)
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
            console.log(`[Record] New record for ${record.patientId}`)
            medicalRecords.value.push(record)
            }
        })

        saveToCache()
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

    fetchData()

    return {
        updates: sortedUpdates,
        fetchData,
        loading,
        error,
    }
}
