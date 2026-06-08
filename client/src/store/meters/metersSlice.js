import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import meterService from '../../services/meterService';

const initialState = {
    meters: [],
    isLoading: false,
    error: null,
};

// Fetch meters
export const fetchMeters = createAsyncThunk('meters/fetchMeters', async (_, thunkAPI) => {
    try {
        return await meterService.getMeters();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

// Create new meter
export const createMeterAsync = createAsyncThunk('meters/createMeter', async (meterData, thunkAPI) => {
    try {
        return await meterService.createMeter(meterData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

// Update meter
export const updateMeterAsync = createAsyncThunk('meters/updateMeter', async ({ id, data }, thunkAPI) => {
    try {
        return await meterService.updateMeter(id, data);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

// Delete meter
export const deleteMeterAsync = createAsyncThunk('meters/deleteMeter', async (id, thunkAPI) => {
    try {
        return await meterService.deleteMeter(id);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || error.toString());
    }
});

const metersSlice = createSlice({
    name: 'meters',
    initialState,
    reducers: {
        // We can keep these for optimistic updates if needed, 
        // but it's better to rely on extraReducers.
        clearMeters: (state) => {
            state.meters = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Meters
            .addCase(fetchMeters.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMeters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.meters = action.payload;
            })
            .addCase(fetchMeters.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create Meter
            .addCase(createMeterAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createMeterAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.meters.push(action.payload);
            })
            .addCase(createMeterAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update Meter
            .addCase(updateMeterAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateMeterAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.meters.findIndex(m => m.id === action.payload.id);
                if (index !== -1) {
                    state.meters[index] = action.payload;
                }
            })
            .addCase(updateMeterAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Delete Meter
            .addCase(deleteMeterAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteMeterAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.meters = state.meters.filter(m => m.id !== action.payload.id);
            })
            .addCase(deleteMeterAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearMeters } = metersSlice.actions;

export default metersSlice.reducer;
