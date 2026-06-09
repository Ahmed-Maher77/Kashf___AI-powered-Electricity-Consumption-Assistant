import { apiFetch, parseApiResponse } from "./apiClient";

const API_URL = "/api/simulations";

// Get user simulations
const getSimulations = async () => {
    const response = await apiFetch(API_URL);
    const parsed = await parseApiResponse(response);
    return parsed.data;
};

// Get single simulation
const getSimulation = async (id) => {
    const response = await apiFetch(`${API_URL}/${id}`);
    const parsed = await parseApiResponse(response);
    return parsed.data;
};

// Create new simulation
const createSimulation = async (simulationData) => {
    const response = await apiFetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(simulationData),
    });
    const parsed = await parseApiResponse(response);
    return parsed.data;
};

// Delete simulation
const deleteSimulation = async (id) => {
    const response = await apiFetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    const parsed = await parseApiResponse(response);
    return parsed.data;
};

// Add circuit
const addCircuit = async (simulationId, circuitData) => {
    const response = await apiFetch(`${API_URL}/${simulationId}/circuits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(circuitData),
    });
    const parsed = await parseApiResponse(response);
    return parsed.data;
};

// Update circuit
const updateCircuit = async (simulationId, circuitId, circuitData) => {
    const response = await apiFetch(`${API_URL}/${simulationId}/circuits/${circuitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(circuitData),
    });
    const parsed = await parseApiResponse(response);
    return parsed.data;
};

// Delete circuit
const deleteCircuit = async (simulationId, circuitId) => {
    const response = await apiFetch(`${API_URL}/${simulationId}/circuits/${circuitId}`, {
        method: "DELETE",
    });
    const parsed = await parseApiResponse(response);
    return parsed.data;
};


// Add device
const addDevice = async (simulationId, deviceData) => {
    const response = await apiFetch(`${API_URL}/${simulationId}/devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deviceData),
    });
    const parsed = await parseApiResponse(response);
    return parsed.data;
};

// Update device
const updateDevice = async (simulationId, deviceId, deviceData) => {
    const response = await apiFetch(`${API_URL}/${simulationId}/devices/${deviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deviceData),
    });
    const parsed = await parseApiResponse(response);
    return parsed.data;
};

// Delete device
const deleteDevice = async (simulationId, deviceId) => {
    const response = await apiFetch(`${API_URL}/${simulationId}/devices/${deviceId}`, {
        method: "DELETE",
    });
    const parsed = await parseApiResponse(response);
    return parsed.data;
};

// Engine control
const startSimulation = async (id) => {
    const response = await apiFetch(`${API_URL}/${id}/start`, { method: "POST" });
    const parsed = await parseApiResponse(response);
    return parsed.data;
};

const pauseSimulation = async (id) => {
    const response = await apiFetch(`${API_URL}/${id}/pause`, { method: "POST" });
    const parsed = await parseApiResponse(response);
    return parsed.data;
};

const resetSimulation = async (id) => {
    const response = await apiFetch(`${API_URL}/${id}/reset`, { method: "POST" });
    const parsed = await parseApiResponse(response);
    return parsed.data;
};

const simulationService = {
    getSimulations,
    getSimulation,
    createSimulation,
    deleteSimulation,
    addCircuit,
    updateCircuit,
    deleteCircuit,
    addDevice,
    updateDevice,
    deleteDevice,
    startSimulation,
    pauseSimulation,
    resetSimulation
};

export default simulationService;
