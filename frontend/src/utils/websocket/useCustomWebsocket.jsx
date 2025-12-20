import { useState, useCallback } from 'react'


function useCustomWebsocket(url,method,info,setServerMsgs) {
    const [data,setData] = useState(null);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    const wsCallback = useCallback(async () => {

    }
        
    
    return [ data, loading, error, fetchCallback ];
}

export default useCustomWebsocket