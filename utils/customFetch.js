import {refreshAuthToken} from "../api";

const BASE_URL = 'https://smarty-tabs-3a031b6e2201.herokuapp.com/api/v1'

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error)
        else prom.resolve(token)
    })

    failedQueue = []
}

export const customFetch = async (url, options = {}) => {
    try {
        const res = await fetch(`${BASE_URL}${url}`, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${options.token || ''}`
            }
        })

        if (res.status === 401) {
            const originalRequest = {url, options}
            if (!isRefreshing) {
                isRefreshing = true

                try {
                    const newToken = await refreshAuthToken()
                    const { access_token, refresh_token } = newToken
                    chrome.storage.sync.set({ authToken: access_token }, () => {
                        console.log("Токен обновлён и сохранён")
                    })
                    chrome.storage.sync.set({ refreshToken: refresh_token }, () => {
                        console.log("Токен обновлён и сохранён")
                    })
                    processQueue(null, access_token)
                } catch (e) {
                    processQueue(e, null);
                    chrome.storage.sync.clear()
                    window.location.href = '../index.html'
                    throw e
                } finally {
                    isRefreshing = false
                }
            }

            return new Promise((resolve, reject) => {
                failedQueue.push(
                    {
                        resolve: token => {
                            originalRequest.options.token = token
                            resolve(customFetch(originalRequest.url, originalRequest.options))
                        },
                        reject: e => {
                            reject(e)
                        }
                    }
                )
            })
        }

        return res
    } catch (e) {
        console.error("Ошибка при выполнении запроса:", e)
        throw e
    }
}