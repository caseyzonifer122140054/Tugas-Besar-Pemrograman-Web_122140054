import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const addTrip = createAsyncThunk(
  'trip/addTrip',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/trips/store', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Gagal membuat trip');
    }
  }
);

export const fetchTripById = createAsyncThunk(
  'trip/fetchById',
  async (tripId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/trips/${tripId}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Trip tidak ditemukan');
    }
  }
);

export const getAllTrips = createAsyncThunk(
  'trip/getAllTrips',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/trips');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Gagal mengambil data trip');
    }
  }
);

const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    trip: null,
    trips: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ADD TRIP
      .addCase(addTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTrip.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // FETCH BY ID
      .addCase(fetchTripById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.loading = false;
        state.trip = action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // GET ALL TRIPS
      .addCase(getAllTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(getAllTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default tripSlice.reducer;
