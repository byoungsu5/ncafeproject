'use client';

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [value, setValue] = useState('');
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            onSearch(value);
        }, 300);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [value, onSearch]);

    return (
        <div className={styles.wrapper}>
            <Search size={18} className={styles.icon} />
            <input
                type="text"
                className={styles.input}
                placeholder="메뉴 검색..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}
