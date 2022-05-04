export function store(namespace, data) {
    if (typeof window !== "undefined") {
        if (data) return localStorage[namespace] = JSON.stringify(data);

        let store = localStorage[namespace];
        return store && JSON.parse(store) || [];
    } else {
        return [];
    }
}