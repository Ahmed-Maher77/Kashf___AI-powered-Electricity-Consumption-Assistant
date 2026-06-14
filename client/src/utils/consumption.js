/**
 * Consumption helpers aligned with server/src/services/simulation.whatif.js
 * Formula: kWh = (loadW / 1000) × durationHours
 */

export function getDeviceWattage(device) {
    return device?.wattage ?? device?.power ?? 0;
}

export function computeCircuitsLoadW(circuits) {
    if (!circuits?.length) return 0;

    let total = 0;
    for (const circuit of circuits) {
        for (const device of circuit.devices || []) {
            if (device.isOn) total += getDeviceWattage(device);
        }
    }
    return total;
}

export function computeProjectedKWh(loadW, durationMinutes) {
    const durationHours = (durationMinutes || 0) / 60;
    return (loadW / 1000) * durationHours;
}

export function computeDeviceKWh(device, durationMinutes) {
    if (!device?.isOn) return 0;
    return computeProjectedKWh(getDeviceWattage(device), durationMinutes);
}

/** Elapsed simulation time in minutes (engine ticks once per second). */
export function getSimulationDurationMinutes(runtime) {
    return (runtime?.tickCount || 0) / 60;
}

export function flattenDevicesWithConsumption(circuits, runtime) {
    const durationMinutes = getSimulationDurationMinutes(runtime);
    const devices = [];

    for (const circuit of circuits || []) {
        for (const device of circuit.devices || []) {
            const consumptionKWh = computeDeviceKWh(device, durationMinutes);
            devices.push({
                id: device._id || device.id,
                name: device.name,
                circuitName: circuit.name,
                wattage: getDeviceWattage(device),
                isOn: device.isOn,
                consumptionKWh: +consumptionKWh.toFixed(4),
            });
        }
    }

    return devices;
}

export function computeTotalConsumptionKWh(circuits, runtime) {
    const durationMinutes = getSimulationDurationMinutes(runtime);
    const loadW = computeCircuitsLoadW(circuits);
    return +computeProjectedKWh(loadW, durationMinutes).toFixed(4);
}

export function formatKWh(value) {
    if (value == null || Number.isNaN(value)) return '0';
    if (value >= 100) return value.toFixed(1);
    if (value >= 1) return value.toFixed(2);
    if (value >= 0.01) return value.toFixed(3);
    return value.toFixed(4);
}
