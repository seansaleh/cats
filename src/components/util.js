export function store(namespace, data) {
    if (typeof window !== "undefined") {
        if (data != null) return localStorage[namespace] = JSON.stringify(data);

        let result = localStorage[namespace];
        if (result != null) {
            return JSON.parse(result);
        }
    } 
    return null
}