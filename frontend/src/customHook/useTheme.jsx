import {useCallback, useLayoutEffect, useState} from "react";

const THEME_KEY = 'dark-mode';

const disableTransitionsTemporarily = () => {
    const body = document.body;
    body.classList.add('no-transition');

    setTimeout(() => {
        body.classList.remove('no-transition');
    }, 50);
};

// 다크모드 관리를 위한 커스텀 훅
const useTheme = () => {
    //초기 상태 로드
    const getInitailMode = () => {
        const storedMode = localStorage.getItem(THEME_KEY);
        if (storedMode !== null) {
            return storedMode === 'true';
        }

        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    const [isDarkMode, setIsDarkMode] = useState(getInitailMode);

    // 다크모드 클래스 적용 후 localStorage 저장
    const applyTheme = useCallback((isDark) => {
        document.body.classList.toggle('dark-theme', isDark);
        localStorage.setItem(THEME_KEY, isDark.toString());
    }, []);

    // 상태 변경 핸들러
    const toggleDarkMode = () => {
        disableTransitionsTemporarily();

        setIsDarkMode(prev => {
            const newMode = !prev;
            applyTheme(newMode);
            return newMode;
        });
    };

    // 컴포넌트 마운트 시 초기 설정
    // useEffect(() => {
    //     applyTheme(isDarkMode);
    // }, [isDarkMode, applyTheme]);

    useLayoutEffect(() => {
        document.body.classList.toggle('dark-theme', isDarkMode);
    }, [isDarkMode]);

    return {isDarkMode, toggleDarkMode};
}

export default useTheme;