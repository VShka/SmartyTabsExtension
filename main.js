import { getCategories } from './api.js'
chrome.storage.sync.get("authToken", (result) => {
    let token = result.authToken

    if (token) {
        init(token)
    } else {
        authInit()
    }
})

const init = (token) => {
    const categorySelect = document.getElementById('category');

    // Обработчик для запроса категорий при фокусе на селекторе
    categorySelect.addEventListener('click', async () => {
        const categories = await getCategories(token)
        console.log(categories)

        // Очистка старых опций
        categorySelect.innerHTML = '';

        // Добавление новых опций
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    });
}
