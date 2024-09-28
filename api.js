import {customFetch} from './utils/customFetch'
const BASE_URL = 'https://smarty-tabs-3a031b6e2201.herokuapp.com/api/v1'
const AUTH_REFRESH_ENDPOINT = 'auth/refresh'
const CATEGORY_ENDPOINT = '/user/titles'
const SUB_CATEGORY_ENDPOINT = 'user/titles'

export const refreshAuthToken = async () => {
    const { refreshToken } = await new Promise((resolve) => {
        chrome.storage.sync.get(['refreshToken'], resolve);
    });

    if (!refreshToken) {
        throw new Error("Отсутствует refreshToken");
    }
    // Запрос для получения нового токена
    const response = await customFetch(`${BASE_URL}${AUTH_REFRESH_ENDPOINT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!response.ok) {
        throw new Error('Не удалось обновить токен');
    }

    return await response.json();
}
export const getCategories = async () => {
    const { authToken } = await new Promise((resolve) => {
        chrome.storage.sync.get(['authToken'], resolve);
    });

    try {
        const response = await customFetch(CATEGORY_ENDPOINT, {
            method: "GET",
            token: authToken
        });

        const result = await response.json();
        console.log(result);

        return result
    } catch (error) {
        console.error("Ошибка:", error);
    }
}

export const getSubCategories = async (categoryId) => {
    const { authToken } = await new Promise((resolve) => {
        chrome.storage.sync.get(['authToken'], resolve);
    });

    try {
        const response = await customFetch(`${SUB_CATEGORY_ENDPOINT}/${categoryId}/resources/`, {
            method: "GET",
            token: authToken
        });

        const result = await response.json();
        console.log(result);

        return result
    } catch (error) {
        console.error("Ошибка:", error);
    }
}