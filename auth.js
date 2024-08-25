const submitBtn = document.getElementById("submitBtn");
const inputEmail = document.getElementById("mail");
const inputPassword = document.getElementById("password");
console.log("Скрипт загружен успешно");
const BASE_URL = 'https://smarty-tabs-3a031b6e2201.herokuapp.com/api/v1'
const AUTH_ENDPOINT = '/auth/login'

const getDeviceInfo = async () => {
    const deviceToken = window.crypto.randomUUID();
    const deviceId = window.crypto.randomUUID();
    chrome.storage.sync.set({ deviceToken: deviceToken }, () => {
        console.log("Токен девайса сохранён");
    });
    chrome.storage.sync.set({ deviceId: deviceId }, () => {
        console.log("ID девайса сохранён");
    });
    return {
        device_token: deviceToken,
        device_id: deviceId,
        device_type: navigator?.userAgentData?.platform || navigator?.platform, // платформа/ОС
    };
}



submitBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // чтобы предотвратить перезагрузку страницы

    const email = inputEmail.value;
    const password = inputPassword.value;
    const deviceInfo = await getDeviceInfo();

    const authData = {
        email,
        password,
        device_info: deviceInfo
    }

    // Пример отправки данных на сервер
    try {
        const response = await fetch(`${BASE_URL}${AUTH_ENDPOINT}`, {
            method: "POST",
            body: JSON.stringify(authData),
            headers: {
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        const { accessToken, refreshToken } = result;

        // chrome.storage.sync.set({ authToken: accessToken }, () => {
        //     console.log("Токен сохранён");
        // });
        // chrome.storage.sync.set({ refreshToken: refreshToken }, () => {
        //     console.log("Токен сохранён");
        // });
        console.log(result);

        // Дальнейшие действия в зависимости от результата
    } catch (error) {
        console.error("Ошибка:", error);
    }
});
//
//
// // Для получения токена
// chrome.storage.sync.get("authToken", (result) => {
//     console.log("Токен из хранилища:", result.authToken);
// });
