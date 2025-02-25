const btnDarkMode = document.querySelector(".dark-mode-btn");
// Мультиязычность 
const select = document.querySelector('.change-lang');
const allLang = ['en', 'fr', 'kz', 'ru'];
function loadLanguage() {
    let hash = window.location.hash.substr(1);
    let savedLang = localStorage.getItem('lang');

    if (allLang.includes(hash)) {
        localStorage.setItem('lang', hash); // Сохраняем язык из URL
    } else if (savedLang && allLang.includes(savedLang)) {
        window.location.hash = savedLang; // Устанавливаем сохранённый язык
    } else {
        window.location.hash = 'en'; // Язык по умолчанию
        localStorage.setItem('lang', 'en');
    }

    changeLanguage(); // Применяем перевод
}
// Перенаправить на URL с указанием языка
function changeURLLanguage() {
    let lang = select.value;
    localStorage.setItem('lang', lang); // Сохраняем выбор
    history.replaceState(null, null, '#' + lang); // Меняем hash без перезагрузки
    changeLanguage();
}

// Функция смены языка с проверками на наличие элементов
function changeLanguage() {
    let hash = window.location.hash.substr(1);
    if (!allLang.includes(hash)) {
        location.href = window.location.pathname + '#en';
        location.reload();
    }
    if (select) {
        select.value = hash;
    }
    // Общие элементы для всех страниц
    if (document.querySelector('title')) {
        document.querySelector('title').innerHTML = langArr['unit'][hash];
    }
    document.querySelectorAll('[data-lang-' + hash + ']').forEach(function (elem) {
        let translation = elem.getAttribute('data-lang-' + hash);
        if (translation) {
            elem.textContent = translation;
        }
    });
    if (window.location.pathname.includes("index.html")) {
        if (document.querySelector('.header__title')) {
            let headerTitle = document.querySelector('.header__title');
            let lang = hash; // Текущий язык из URL
            headerTitle.innerHTML = headerTitle.getAttribute(`data-lang-${lang}`);
            //headerTitle.innerHTML = langArr['#header__title'][lang];
        }
        if (document.querySelector('.header-text')) {
            document.querySelector('.header-text').innerHTML = langArr['header-text'][hash];
        }
        if (document.querySelector('.btn')) {
            document.querySelector('.btn').innerHTML = langArr['btn'][hash];
        }
        if (document.getElementById('title-1')) {
            document.getElementById('title-1').innerHTML = langArr['title-1'][hash];
        }
        // Проверяем наличие элементов перед изменением
        let ids = ['name1', 'name2', 'name3', 'name4', 'name5', 'name6'];
        ids.forEach(id => {
            let elem = document.getElementById(id);
            if (elem) {
                elem.innerHTML = langArr[id][hash];
            }
        });

    }
    // Страница Skills
    if (window.location.pathname.includes("skills.html")) {
        let skillsTitle = document.getElementById('title-1-1');
        if (skillsTitle) {
            skillsTitle.innerHTML = langArr['title-1-1'][hash];
        }
        let hardSk = document.getElementById("title-2-1");
        if (hardSk) {
            hardSk.innerHTML = langArr['title-2-1'][hash];
        }
        let softSk = document.getElementById("title-2-2");
        if (softSk) {
            softSk.innerHTML = langArr['title-2-2'][hash];
        }
        let softSkText = document.getElementById("title-2-text");
        if (softSkText) {
            softSkText.innerHTML = langArr['title-2-text'][hash];
        }
    }
    // Страница About.skills
    if (window.location.pathname.includes("about.html")) {
        let about = document.getElementById('title-1-1-1');
        if (about) {
            about.innerHTML = langArr['title-1-1-1'][hash];
        }
        let aboutText = document.getElementById('title-2-2-text1');
        if (aboutText) {
            aboutText.innerHTML = langArr['title-2-2-text1'][hash];
        }
        let educ = document.getElementById('title-2-2-2');
        if (educ) {
            educ.innerHTML = langArr['title-2-2-2'][hash];
        }
        let educText = document.getElementById('title-2-2-text2');
        if (educText) {
            educText.innerHTML = langArr['title-2-2-text2'][hash];
        }
        let profEx = document.getElementById('title-3-3-3');
        if (profEx) {
            profEx.innerHTML = langArr['title-3-3-3'][hash];
        }
        let profExText = document.getElementById('title-3-3-text3');
        if (profExText) {
            profExText.innerHTML = langArr['title-3-3-text3'][hash];
        }
        let profExText1 = document.querySelector('#title-3-3-text3bis');
        if (profExText1) { // Ссылка 
            profExText1.innerHTML = langArr['title-3-3-text3bis'][hash];
        }
        let profExText2 = document.getElementById('title-3-3-text3bis1');
        if (profExText2) {
            profExText2.innerHTML = langArr['title-3-3-text3bis1'][hash];
        }
        let profExText3 = document.getElementById('title-3-3-text3bis2');
        if (profExText3) { // Ссылка 
            profExText3.innerHTML = langArr['title-3-3-text3bis2'][hash];
        }
        let interest = document.getElementById('title-4-4-4');
        if (interest) {
            interest.innerHTML = langArr['title-4-4-4'][hash];
        }
        let interestText = document.getElementById('title-4-4-text4');
        if (interestText) {
            interestText.innerHTML = langArr['title-4-4-text4'][hash];
        }
    }
}
window.addEventListener('hashchange', changeLanguage);
loadLanguage();
if (select) {
    select.addEventListener('change', changeURLLanguage);
}
// 1. Проверка темной темы на уровне системных настроек
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    btnDarkMode.classList.add("dark-mode-btn--active");
    document.body.classList.add("dark");
}
// 2. Проверка темной темы в localStorage
if (localStorage.getItem('darkMode') === 'dark') {
    btnDarkMode.classList.add("dark-mode-btn--active");
    document.body.classList.add("dark");
} else if (localStorage.getItem("darkMode") === "light") {
    btnDarkMode.classList.remove("dark-mode-btn--active");
    document.body.classList.remove("dark");
}
// Если меняются системные настройки, меняем тему
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
        const newColorScheme = event.matches ? "dark" : "light";

        if (newColorScheme === "dark") {
            btnDarkMode.classList.add("dark-mode-btn--active");
            document.body.classList.add("dark");
            localStorage.setItem("darkMode", "dark");
        } else {
            btnDarkMode.classList.remove("dark-mode-btn--active");
            document.body.classList.remove("dark");
            localStorage.setItem("darkMode", "light");
        }
    });
// Включение ночного режима по кнопке
btnDarkMode.onclick = function () {
    btnDarkMode.classList.toggle("dark-mode-btn--active");
    const isDark = document.body.classList.toggle("dark");

    if (isDark) {
        localStorage.setItem("darkMode", "dark");
    } else {
        localStorage.setItem("darkMode", "light");
    }
};