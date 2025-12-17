import { API_BASE } from './config';

export function ajaxService(url, options = {}) {
    const { headers = {}, ...rest } = options;
    const mergedHeaders = {'Content-Type': 'application/json', ...headers};

    return fetch(`${API_BASE}${url}`, {
        headers: mergedHeaders,
        ...rest,
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        if (response.status === 204) {
            return null;
        }
        return response.text().then((text) => {
            if (!text) return null;
            try {
                return JSON.parse(text);
            } catch {
                return text;
            }
        });
    });
}
