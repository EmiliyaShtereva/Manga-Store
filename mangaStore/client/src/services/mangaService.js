const baseUrl = 'http://localhost:3030/jsonstore/manga';

export const getAll = async () => {
    const response = await fetch(baseUrl, {
        method: 'GET',
    });
    const result = await response.json();
    return Object.values(result);
}

export const getFive = async () => {
    const response = await fetch(baseUrl, {
        method: 'GET',
    });
    const result = await response.json();
    return Object.values(result).slice(-5);
}

// export const getOne = async (gameId) => {
//     const result = await request.get(`${baseUrl}/${gameId}`);
//     return result
// }

// export const create = async (gameData) => {
//     const result = await request.post(baseUrl, gameData);
//     return result;
// }