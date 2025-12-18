import { useState, useEffect } from 'react'

function useFetch(url) {
    const [data,setData] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Something went wrong when retrieving the data. Server status code: ${response.status}`);
            }

                const json = await response.json();
                setData(json);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchAPI();
        
    }, [url]);
    return { data, loading, error };
}

export default useFetch