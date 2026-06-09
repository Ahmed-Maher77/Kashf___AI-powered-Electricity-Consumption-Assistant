import { createSlice } from '@reduxjs/toolkit';
import { AlertTriangle, TrendingUp, Sparkles, Bell } from 'lucide-react';

const INITIAL_ALERTS = [
    {
        id: 1,
        type: 'warning',
        titleKey: 'alerts.data.alert1.title',
        messageKey: 'alerts.data.alert1.message',
        timeKey: 'alerts.data.alert1.time',
        iconName: 'AlertTriangle',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        ring: 'ring-amber-500/30',
        isRead: false
    },
    {
        id: 2,
        type: 'critical',
        titleKey: 'alerts.data.alert2.title',
        messageKey: 'alerts.data.alert2.message',
        timeKey: 'alerts.data.alert2.time',
        iconName: 'TrendingUp',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        ring: 'ring-red-500/30',
        isRead: false
    },
    {
        id: 3,
        type: 'recommendation',
        titleKey: 'alerts.data.alert3.title',
        messageKey: 'alerts.data.alert3.message',
        timeKey: 'alerts.data.alert3.time',
        iconName: 'Sparkles',
        color: 'text-kashf-light-blue',
        bg: 'bg-kashf-blue/10',
        ring: 'ring-kashf-blue/30',
        isRead: true
    },
    {
        id: 4,
        type: 'system',
        titleKey: 'alerts.data.alert4.title',
        messageKey: 'alerts.data.alert4.message',
        timeKey: 'alerts.data.alert4.time',
        iconName: 'Bell',
        color: 'text-neutral-400',
        bg: 'bg-neutral-800',
        ring: 'ring-neutral-500/30',
        isRead: true
    }
];

const alertsSlice = createSlice({
    name: 'alerts',
    initialState: {
        alerts: INITIAL_ALERTS,
        unreadCount: INITIAL_ALERTS.filter(a => !a.isRead).length
    },
    reducers: {
        markAsRead: (state, action) => {
            const alert = state.alerts.find(a => a.id === action.payload);
            if (alert && !alert.isRead) {
                alert.isRead = true;
                state.unreadCount -= 1;
            }
        },
        markAllAsRead: (state) => {
            state.alerts.forEach(alert => {
                alert.isRead = true;
            });
            state.unreadCount = 0;
        },
        deleteAlert: (state, action) => {
            const alert = state.alerts.find(a => a.id === action.payload);
            if (alert && !alert.isRead) {
                state.unreadCount -= 1;
            }
            state.alerts = state.alerts.filter(a => a.id !== action.payload);
        }
    }
});

export const { markAsRead, markAllAsRead, deleteAlert } = alertsSlice.actions;
export default alertsSlice.reducer;
