import { useState, useEffect } from "react";

const useLessons = (filters) => {
    const [lessons, setLessons] = useState([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        links: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLessons = async () => {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams(filters).toString();
            const url = `http://localhost:8000/api/lessons?${queryParams}`;

            try {
                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch lessons");
                }

                const data = await response.json();
                setLessons(data.data);
                setPagination({
                    current_page: data.current_page || 1,
                    last_page: data.last_page || 1,
                    total: data.total || 0,
                    links: data.links || [],
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLessons();
    }, [filters]);

    return { lessons, pagination, loading, error };
};

export default useLessons;
