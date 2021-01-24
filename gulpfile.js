// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp');

// Подключаем Browsersync
const browserSync = require('browser-sync').create();

// Подключаем gulp-concat
const concat = require('gulp-concat');

// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');

// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');

// Подключаем gulp-imagemin для работы с изображениями
const imagemin = require('gulp-imagemin');

// Подключаем модуль gulp-newer
const newer = require('gulp-newer');

// Подключаем модуль del
const del = require('del');

// Определяем логику работы Browsersync
function browsersync() {
    browserSync.init({ // Инициализация Browsersync
        server: { baseDir: 'application/' }, // Указываем папку сервера
        notify: false, // Отключаем уведомления
        online: true // Режим работы: true или false
    })
}

function scripts() {
    return src(['application/js/**/*.js', '!application/js/**/particles.js']) // Берём файлы из источников
        .pipe(uglify()) // Сжимаем JavaScript
        .pipe(dest('dist/js/')) // Выгружаем готовый файл в папку назначения
        .pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function styles() {
    return src(['application/css/**/*.css', '!application/css/**/particles.css']) // Берём все файлы со стилями из папки источника
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
        .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
        .pipe(dest('dist/css/')) // Выгрузим результат в папку "application/css/"
        .pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function images() {
    return src('application/images/**/*') // Берём все изобsражения из папки источника
        .pipe(newer('dist/images/**/*')) // Проверяем, было ли изменено (сжато) изображение ранее
        .pipe(imagemin()) // Сжимаем и оптимизируем изображеня
        .pipe(dest('dist/images/')) // Выгружаем оптимизированные изображения в папку назначения
}

function cleanimg() {
    return del('dist/images/', { force: true }) // Удаляем всё содержимое папки "application/images/dest/"
}

function buildcopy() {
    return src([ // Выбираем нужные файлы
        'application/css/**/*.min.css',
        'application/css/**/particles.css',
        'application/js/**/*.min.js',
        'application/js/**/particles.js',
        'application/images/dest/**/*',
        'application/**/*.html',
        'application/fonts/**/*',
        'application/ico/**/*',
        'application/ajax/*.php',
        'application/.htaccess',
        'application/robots.txt',
        'application/manifest.json',
        'application/service-worker.js',
        'application/sitemap.xml',
    ], { base: 'application' }) // Параметр "base" сохраняет структуру проекта при копировании
        .pipe(dest('dist')) // Выгружаем в папку с финальной сборкой
}

function cleandist() {
    return del('dist/**/*', { force: true }) // Удаляем всё содержимое папки "dist/"
}

function startwatch() {

    // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
    watch(['applicationlication/**/*.js', '!applicationlication/**/*.min.js'], scripts);

    // Мониторим файлы препроцессора на изменения
    watch('applicationlication/css/**/*', styles);

    // Мониторим файлы HTML на изменения
    watch('applicationlication/**/*.html').on('change', browserSync.reload);

    // Мониторим папку-источник изображений и выполняем images(), если есть изменения
    watch('applicationlication/images/**/*', images);

}

// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;

// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;

// Экспортируем функцию styles() в таск styles
exports.styles = styles;

// Экспорт функции images() в таск images
exports.images = images;

// Экспортируем функцию cleanimg() как таск cleanimg
exports.cleanimg = cleanimg;

// Создаём новый таск "build", который последовательно выполняет нужные операции
exports.build = series(cleandist, styles, scripts, images, buildcopy);

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, scripts, browsersync, startwatch);