interface ApiError extends Error {
    status: number;
}

export async function fetchAPI(endpoint: string, options?: RequestInit) {
    const res = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options?.headers,
        },
    });

    if (!res.ok) {
        if (res.status === 401 && typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            if (currentPath !== '/login') {
                window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }
            return;
        }
        const error = new Error(`API Error: ${res.status}`) as ApiError;
        error.status = res.status;
        try {
            const body = await res.json();
            error.message = body.message || error.message;
        } catch { /* no json body */ }
        throw error;
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return res.json();
    }
    return null;
}

export const authAPI = {
    login: (username: string, password: string) =>
        fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        }),

    logout: () =>
        fetchAPI('/auth/logout', { method: 'POST' }),

    getSession: () => fetchAPI('/auth/session'),
};

export async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/images/upload', {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error('Image upload failed');
    }

    return res.json();
}
