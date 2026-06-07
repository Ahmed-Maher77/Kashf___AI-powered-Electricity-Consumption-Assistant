import { useState, useEffect, useCallback } from "react";
import { getActivity } from "../services/activityService";

/**
 * Hook to fetch and paginate the current user's activity history.
 */
const useActivity = ({ limit = 20 } = {}) => {
    const [items, setItems]         = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [page, setPage]           = useState(1);
    const [hasMore, setHasMore]     = useState(false);
    const [total, setTotal]         = useState(0);

    const fetchActivity = useCallback(async (pageNum = 1) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getActivity({ page: pageNum, limit });
            const result = data.data;
            setItems(prev => pageNum === 1 ? result.items : [...prev, ...result.items]);
            setHasMore(result.hasMore);
            setTotal(result.total);
        } catch (err) {
            setError(err.message ?? "Failed to load activity.");
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchActivity(1);
    }, [fetchActivity]);

    const loadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchActivity(next);
    };

    const refresh = () => {
        setPage(1);
        fetchActivity(1);
    };

    return { items, loading, error, hasMore, total, loadMore, refresh };
};

export default useActivity;
