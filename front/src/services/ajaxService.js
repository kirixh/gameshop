export function ajaxService(url) {
    return fetch('http://127.0.0.1:8000/api/v1' + url).then((response) => {
        return response.json();
    });
}
