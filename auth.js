document.addEventListener("DOMContentLoaded", () => {
    // chrome.storage.sync.set({authToken: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ2aWt0b3Iuc2hrYXJ1cGFAeWFuZGV4LnJ1IiwiaWF0IjoxNzI0NjE5MDg1LCJleHAiOjE3MjQ2MTk5ODUsImF1dGhvcml0aWVzIjoiUk9MRV9VU0VSIn0.4rqUNwt-DlThsI3m_Xci_4NA7NAOpUBWkmUsThJBSP8vPx2ZywkIzA9xxaRgyZpoMSztDbtJ_9Q0diPPhDYN1w'})
    chrome.storage.sync.get("authToken", (result) => {
        console.log("Токен из хранилища:", result.authToken);
        if (result.authToken) {
            window.location.href = 'app.html'
            // отправить на другую страницу
        } else {
            console.log('here')
            authInit()
        }
    });
})

const getDeviceInfo = async () => {
    const notification_token = window.crypto.randomUUID();
    const deviceId = window.crypto.randomUUID();
    chrome.storage.sync.set({ notificationToken: notification_token }, () => {
        console.log("Токен сообщения сохранён");
    });
    chrome.storage.sync.set({ deviceId: deviceId }, () => {
        console.log("ID девайса сохранён");
    });
    return {
        notification_token,
        device_id: deviceId,
        device_type: navigator?.userAgentData?.platform || navigator?.platform, // платформа/ОС
    };
}
function authInit() {
    const submitBtn = document.getElementById("submitBtn");
    const inputEmail = document.getElementById("mail");
    const inputPassword = document.getElementById("password");
    console.log("Скрипт загружен успешно");
    const BASE_URL = 'https://smarty-tabs-3a031b6e2201.herokuapp.com/api/v1'
    const AUTH_ENDPOINT = '/auth/login'

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

            chrome.storage.sync.set({ authToken: accessToken }, () => {
                console.log("Токен сохранён");
            });
            chrome.storage.sync.set({ refreshToken: refreshToken }, () => {
                console.log("Рефреш токен сохранён");
            });

            // Дальнейшие действия в зависимости от результата
        } catch (error) {
            console.error("Ошибка:", error);
        }
    });
}




