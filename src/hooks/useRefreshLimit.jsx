import { useState, useEffect, useCallback, useRef } from 'react';

const REFRESH_LIMIT = 5;
const STORAGE_KEY = 'app_refresh_metrics';
const BASE_COOLDOWN_MS = 5000;

export const useRefreshLimit = () => {
    const [status, setStatus] = useState({
        isBlocked: false,
        remainingCooldown: 0,
    });

    // Protección contra doble montaje de React StrictMode
    const hasRun = useRef(false);

    const getMetrics = useCallback(() => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : { count: 0, blockCount: 0, blockedUntil: null };
        } catch {
            return { count: 0, blockCount: 0, blockedUntil: null };
        }
    }, []);

    const saveMetrics = useCallback((metrics) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
    }, []);

    const refreshMetrics = useCallback(() => {
        let metrics = getMetrics();
        const now = Date.now();

        if (metrics.blockedUntil && now >= metrics.blockedUntil) {
            metrics = { count: 0, blockCount: metrics.blockCount, blockedUntil: null };
            saveMetrics(metrics);
        }
        return metrics;
    }, [getMetrics, saveMetrics]);

    const updateLiveStatus = useCallback(() => {
        const metrics = getMetrics();
        const now = Date.now();

        if (!metrics.blockedUntil || now >= metrics.blockedUntil) {
            if (metrics.blockedUntil) {
                saveMetrics({ count: 0, blockCount: metrics.blockCount, blockedUntil: null });
            }
            setStatus({ isBlocked: false, remainingCooldown: 0 });
        } else {
            const remaining = Math.ceil((metrics.blockedUntil - now) / 1000);
            setStatus(prev => ({ ...prev, remainingCooldown: remaining }));
        }
    }, [getMetrics, saveMetrics]);

    // Polling: countdown en vivo + desbloqueo automático
    useEffect(() => {
        if (!status.isBlocked) return;
        const interval = setInterval(updateLiveStatus, 1000);
        return () => clearInterval(interval);
    }, [status.isBlocked, updateLiveStatus]);

    // Lógica principal al montar — hasRun evita doble conteo en StrictMode
    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const metrics = refreshMetrics();
        const now = Date.now();

        if (metrics.blockedUntil && now < metrics.blockedUntil) {
            const remaining = Math.ceil((metrics.blockedUntil - now) / 1000);
            setStatus({ isBlocked: true, remainingCooldown: remaining });
            return;
        }

        const newCount = metrics.count + 1;
        let blockedUntil = null;
        let newBlockCount = metrics.blockCount;

        if (newCount >= REFRESH_LIMIT) {
            newBlockCount += 1;
            const dynamicCooldown = BASE_COOLDOWN_MS * newBlockCount;
            blockedUntil = now + dynamicCooldown;

            setStatus({
                isBlocked: true,
                remainingCooldown: Math.ceil(dynamicCooldown / 1000),
            });
        } else {
            setStatus({ isBlocked: false, remainingCooldown: 0 });
        }

        saveMetrics({ count: newCount, blockCount: newBlockCount, blockedUntil });
    }, [refreshMetrics, saveMetrics]);

    // Preserva blockCount para no perder la penalización acumulada
    const manualReset = useCallback(() => {
        const metrics = getMetrics();
        saveMetrics({ count: 0, blockCount: metrics.blockCount, blockedUntil: null });
        setStatus({ isBlocked: false, remainingCooldown: 0 });
    }, [getMetrics, saveMetrics]);

    return { ...status, manualReset };
};