'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Role {
    authority: string;
}

interface User {
    username: string;
    roles: (string | Role)[];
}

function hasAdminRole(roles?: (string | Role)[]): boolean {
    return roles?.some(role =>
        typeof role === 'string' ? role === 'ROLE_ADMIN' : role.authority === 'ROLE_ADMIN'
    ) ?? false;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (formData: URLSearchParams) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkAuth = useCallback(async () => {
        try {
            const response = await fetch('/api/auth/session');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                return data.user;
            } else {
                setUser(null);
                return null;
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
            setUser(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (formData: URLSearchParams) => {
        const username = formData.get('username') || '';
        const password = formData.get('password') || '';

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || '로그인 요청 중 오류가 발생했습니다.');
        }

        const data = await response.json();
        setUser(data.user);

        // 권한에 따른 라우팅
        if (data.user) {
            if (hasAdminRole(data.user.roles)) {
                router.push('/admin/menus');
            } else {
                router.push('/menus');
            }
        } else {
            router.push('/');
        }

        router.refresh();
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
