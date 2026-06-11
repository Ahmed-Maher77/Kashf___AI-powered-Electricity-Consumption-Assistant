import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import simulationService from '../../services/simulationService';

const initialState = {
    simulations: [],
    currentSimulation: null,
    isLoading: false,
    error: null,
};

// Fetches all simulations available to the user.
export const fetchSimulations = createAsyncThunk('simulations/fetchSimulations', async (_, thunkAPI) => {
    try {
        return await simulationService.getSimulations();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

// Fetches a single simulation by its ID.
export const fetchSimulation = createAsyncThunk('simulations/fetchSimulation', async (id, thunkAPI) => {
    try {
        return await simulationService.getSimulation(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

// Creates a new simulation environment.
export const createSimulationAsync = createAsyncThunk('simulations/createSimulation', async (data, thunkAPI) => {
    try {
        return await simulationService.createSimulation(data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

// Deletes a simulation by its ID.
export const deleteSimulationAsync = createAsyncThunk('simulations/deleteSimulation', async (id, thunkAPI) => {
    try {
        return await simulationService.deleteSimulation(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

// Adds a new electrical circuit to a specific simulation.
export const addCircuitAsync = createAsyncThunk('simulations/addCircuit', async ({ simulationId, data }, thunkAPI) => {
    try {
        return await simulationService.addCircuit(simulationId, data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

// Deletes a specific electrical circuit from a simulation.
export const deleteCircuitAsync = createAsyncThunk('simulations/deleteCircuit', async ({ simulationId, circuitId }, thunkAPI) => {
    try {
        return await simulationService.deleteCircuit(simulationId, circuitId);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

// Adds a new device to an existing circuit within a simulation.
export const addDeviceAsync = createAsyncThunk('simulations/addDevice', async ({ simulationId, data }, thunkAPI) => {
    try {
        return await simulationService.addDevice(simulationId, data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});
// Deletes a device from a simulation.
export const deleteDeviceAsync = createAsyncThunk('simulations/deleteDevice', async ({ simulationId, deviceId }, thunkAPI) => {
    try {
        return await simulationService.deleteDevice(simulationId, deviceId);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});
// Starts the simulation engine for a given simulation.
export const startSimulationAsync = createAsyncThunk('simulations/startSimulation', async (id, thunkAPI) => {
    try {
        return await simulationService.startSimulation(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

// Pauses a running simulation engine.
export const pauseSimulationAsync = createAsyncThunk('simulations/pauseSimulation', async (id, thunkAPI) => {
    try {
        return await simulationService.pauseSimulation(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

// Resets a simulation's state back to its initial configuration.
export const resetSimulationAsync = createAsyncThunk('simulations/resetSimulation', async (id, thunkAPI) => {
    try {
        return await simulationService.resetSimulation(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

// Redux slice handling electrical simulation state, including circuits, devices, and engine status (running/paused).
const simulationSlice = createSlice({
    name: 'simulations',
    initialState,
    reducers: {
        clearSimulations: (state) => {
            state.simulations = [];
            state.currentSimulation = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Simulations
            .addCase(fetchSimulations.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSimulations.fulfilled, (state, action) => {
                state.isLoading = false;
                state.simulations = action.payload;
            })
            .addCase(fetchSimulations.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Fetch Single Simulation
            .addCase(fetchSimulation.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSimulation.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentSimulation = action.payload;
                // Also update in the array if it exists
                const index = state.simulations.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.simulations[index] = action.payload;
                } else {
                    state.simulations.push(action.payload);
                }
            })
            .addCase(fetchSimulation.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create Simulation
            .addCase(createSimulationAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createSimulationAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.simulations.unshift(action.payload);
            })
            .addCase(createSimulationAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Delete Simulation
            .addCase(deleteSimulationAsync.fulfilled, (state, action) => {
                state.simulations = state.simulations.filter(s => s.id !== action.payload.id);
                if (state.currentSimulation?.id === action.payload.id) {
                    state.currentSimulation = null;
                }
            })
            // Add Circuit
            .addCase(addCircuitAsync.fulfilled, (state, action) => {
                const index = state.simulations.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.simulations[index] = action.payload;
                }
                if (state.currentSimulation?.id === action.payload.id) {
                    state.currentSimulation = action.payload;
                }
            })
            // Delete Circuit
            .addCase(deleteCircuitAsync.fulfilled, (state, action) => {
                const index = state.simulations.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.simulations[index] = action.payload;
                }
                if (state.currentSimulation?.id === action.payload.id) {
                    state.currentSimulation = action.payload;
                }
            })
            // Add Device
            .addCase(addDeviceAsync.fulfilled, (state, action) => {
                const index = state.simulations.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.simulations[index] = action.payload;
                }
                if (state.currentSimulation?.id === action.payload.id) {
                    state.currentSimulation = action.payload;
                }
            })
            // Delete Device
            .addCase(deleteDeviceAsync.fulfilled, (state, action) => {
                const index = state.simulations.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.simulations[index] = action.payload;
                }
                if (state.currentSimulation?.id === action.payload.id) {
                    state.currentSimulation = action.payload;
                }
            })
            // Start Simulation
            .addCase(startSimulationAsync.fulfilled, (state, action) => {
                const index = state.simulations.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.simulations[index] = action.payload;
                }
                if (state.currentSimulation?.id === action.payload.id) {
                    state.currentSimulation = action.payload;
                }
            })
            // Pause Simulation
            .addCase(pauseSimulationAsync.fulfilled, (state, action) => {
                const index = state.simulations.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.simulations[index] = action.payload;
                }
                if (state.currentSimulation?.id === action.payload.id) {
                    state.currentSimulation = action.payload;
                }
            })
            // Reset Simulation
            .addCase(resetSimulationAsync.fulfilled, (state, action) => {
                const index = state.simulations.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.simulations[index] = action.payload;
                }
                if (state.currentSimulation?.id === action.payload.id) {
                    state.currentSimulation = action.payload;
                }
            });
    }
});

export const { clearSimulations } = simulationSlice.actions;

export default simulationSlice.reducer;
