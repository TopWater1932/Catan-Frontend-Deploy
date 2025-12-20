import { useState, useCallback } from 'react'

function useFetch(url,method,info,setServerMsgs) {
    const [data,setData] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    const fetchCallback = useCallback(async () => {
        try {
            setLoading(true)
            let response;
            if (method === "GET") {
                response = await fetch(url);
            } else {
                response = await fetch(url, {
                    method: method,
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(info)
                });
            }

            const json = await response.json();

            if (!response.ok) {
                throw new Error(`Server error: ${json.detail} Server status code: ${response.status}`);
            }
            const jsObj = JSON.parse(json)
            setData(jsObj);
            setServerMsgs(prevMsgs => [...prevMsgs,jsObj.msg])
        } catch (error) {
            setError(error);
            setServerMsgs(prevMsgs => [...prevMsgs,error.message])
        } finally {
            setLoading(false);
        }
    }, [url,method,info]);
    
    return [ data, loading, error, fetchCallback ];
}

export default useFetch