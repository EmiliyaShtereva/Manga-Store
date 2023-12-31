const baseUrl = 'http://localhost:3030/data/manga';

export const getAll = async () => {
    const query = new URLSearchParams({
        select: '_id,imageUrl,name,author,price'
    })
    const response = await fetch(`${baseUrl}?${query}`, {
        method: 'GET',
    });
    const result = await response.json();
    return result;
}

export const getLatest = async () => {
    const query = new URLSearchParams({
        offset: 0,
        pageSize: 15
    })
    const response = await fetch(`${baseUrl}?sortBy=_createdOn%20desc${query}`, {
        method: 'GET',
    });
    const result = await response.json();
    return result;
}

export const getOne = async (mangaId) => {
    const response = await fetch(`${baseUrl}/${mangaId}`, {
        method: 'GET',
    });
    const result = await response.json();
    return result;
}

export const getGenre = async (genre) => {
    const query = new URLSearchParams({
        where: `genre="${genre}"`
    })
    const response = await fetch(`${baseUrl}?${query}`, {
        method: 'GET',
    });
    const result = await response.json();
    return result;
}

export const getStatus = async (status) => {
    const query = new URLSearchParams({
        where: `status="${status}"`
    })
    const response = await fetch(`${baseUrl}?${query}`, {
        method: 'GET',
    });
    const result = await response.json();
    return result;
}

export const getGenreAndStatus = async (genre, status) => {
    const response = await fetch(`${baseUrl}?where=genre%3D%22${genre}%22 AND status%3D%22${status}%22`, {
        method: 'GET',
    });
    const result = await response.json();
    return result;
}

export const getSearch = async (search) => {
    const response = await fetch(`${baseUrl}?where=name LIKE %22${search}%22`, {
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
    return result;
}

export const edit = async (mangaId, mangaData) => {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    const response = await fetch(`${baseUrl}/${mangaId}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': token.accessToken
        },
        body: JSON.stringify(mangaData)

    });
    const result = await response.json();
    return result;
}

export const remove = async (mangaId) => {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    await fetch(`${baseUrl}/${mangaId}`, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': token.accessToken
        }
    });
};