const baseUrl = 'http://localhost:3030/users';

export const login = async (data) => {
    const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)

    });
    const result = await response.json();
    return result;
}

export const register = async (data) => {
    const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const result = await response.json();
    return result;
}

export const logout = async () => {
    const token = JSON.parse(localStorage.getItem('accessToken'));
    await fetch(`${baseUrl}/logout`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': token.accessToken
        }
    });
    return {};
}