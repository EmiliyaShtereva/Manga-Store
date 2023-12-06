const baseUrl = 'http://localhost:3030/data/comments';

export const getAll = async (mangaId) => {
    const query = new URLSearchParams({
        where: `mangaId="${mangaId}"`,
        load: `owner=_ownerId:users`
    })
    const response = await fetch(`${baseUrl}?${query}`, {
        method: 'GET',
    });
    const result = await response.json();
    return result;
}

export const create = async (commentData) => {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': token.accessToken
        },
        body: JSON.stringify(commentData)

    });
    const result = await response.json();
    return result;
}