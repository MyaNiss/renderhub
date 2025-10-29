import React, {useState} from 'react';
import {useNavigate} from "react-router";

const UseSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (term) => {
        const query = term.trim();
        if(query === ""){
            alert("검색어를 입력해 주세요");
            return;
        }

        navigate(`/search?q=${encodeURIComponent(query)}`);
    }

    return {searchTerm, setSearchTerm, handleSearch};
};

export default UseSearch;