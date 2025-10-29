import {useCallback, useEffect, useState} from "react";


// 다크모드 관리를 위한 커스텀 훅
const useTheme = () => {
    //초기 상태 로드
    const getInitailMode = () => {
        const storedMode = localStorage.getItem('dark-mode');
        if (storedMode !== null) {
            return storedMode === 'true';
        }

        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDarkMode;
    };

    const [isDarkMode, setIsDarkMode] = useState(getInitailMode);

    // 다크모드 클래스 적용 후 localStorage 저장
    const applyTheme = useCallback((isDark) => {
        document.body.classList.toggle('dark-theme', isDark);
        localStorage.setItem('dark-mode', isDark.toString());
    }, []);

    // 상태 변경 핸들러
    const toggleDarkMode = () => {
        setIsDarkMode(prev => {
            const newMode = !prev;
            applyTheme(newMode);
            return newMode;
        });
    };

    // 컴포넌트 마운트 시 초기 설정
    useEffect(() => {
        applyTheme(isDarkMode);
    }, [isDarkMode, applyTheme]);

    return {isDarkMode, toggleDarkMode};
}

export default useTheme;