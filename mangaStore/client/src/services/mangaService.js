const baseUrl = 'http://localhost:3030/data/manga';

export const getAll = async () => {
    const response = await fetch(baseUrl, {
        method: 'GET',
    });
    const result = await response.json();
    return result;
}

export const getFive = async () => {
    const response = await fetch(baseUrl, {
        method: 'GET',
    });
    const result = await response.json();
    return Object.values(result).slice(-15);
}

export const getOne = async (mangaId) => {
    const response = await fetch(`${baseUrl}/${mangaId}`, {
        method: 'GET',
    });
    const result = await response.json();
    return result;
}

export const create = async (mangaData) => {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': token.accessToken
        },
        body: JSON.stringify(mangaData)

    });
    const result = await response.json();
    console.log(result);
    return result;
}