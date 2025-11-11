import React, {useCallback, useState} from 'react';
import {useNavigate} from "react-router";

const UseSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = useCallback((term) => {
        const query = term.trim();

        if (query === "") {
            alert("검색어를 입력해 주세요");
            handleReset();
            return;
        }

        navigate(`/search?q=${encodeURIComponent(query)}`);

    }, [navigate]);

    const handleReset = useCallback(() => {
        setSearchTerm('');
        navigate('/post');
    }, [navigate]);

    return {searchTerm, setSearchTerm, handleSearch};
};

export default UseSearch;