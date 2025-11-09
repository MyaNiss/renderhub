import React, {useEffect, useState} from 'react';
import {loadTossPayments} from "@tosspayments/payment-sdk";

const TOSS_CLIENT_KEY = process.env.REACT_APP_TOSS_CLIENT_KEY;

export const useTossPayments = () => {
    const [tossPayments, setTossPayments] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeToss = async () => {
            if(!TOSS_CLIENT_KEY) {
                setError(new Error("Toss Client Key가 설정되지 않았습니다"));
                setLoading(false);
                return;
            }
            try{
                const toss = await loadTossPayments(TOSS_CLIENT_KEY);
                setTossPayments(toss);
            }catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        initializeToss();
    }, []);

    return { tossPayments, loading, error };
}