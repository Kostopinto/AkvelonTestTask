const gulp = require('gulp');
const concatCss = require('gulp-concat-css');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglifyJs = require('gulp-uglify');
const concatJs = require('gulp-concat');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const cmq = require('gulp-combine-mq');
const cache = require('gulp-cache');
const cssnano = require('gulp-cssnano');

const paths = {
    src: {
        styles: {
            app: 'src/scss/style.scss',
            appAll: 'src/scss/**/*.scss'
        },
        scripts: {
            appAll: [
        './src/js/main.js'
      ]
        }
    },
    web: {
        styles: {
            app: {
                file: 'style.css',
                dir: 'web/css'
            }
        },
        scripts: {
            app: {
                file: 'main.js',
                dir: './web/js'
            }
        }
    }
};

gulp.task('scss', function () {
    return gulp.src(paths.src.styles.app)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', notify.onError()))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cmq({
            beautify: true
        }))
        .pipe(cssnano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.web.styles.app.dir));
});


gulp.task('js', function () {
    return gulp.src(paths.src.scripts.appAll)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }).on('error', notify.onError()))
        .pipe(concatJs(paths.web.scripts.app.file))
        .pipe(uglifyJs().on('error', notify.onError()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.web.scripts.app.dir));
});


gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: './web'
        }
    });
    gulp.watch([paths.src.styles.appAll], ['scss']);
    gulp.watch([paths.src.scripts.appAll], ['js']);
    browserSync.watch('**/*.*').on('change', browserSync.reload);
});

gulp.task('default', [
  'scss',
  'js',
  'watch'
]);
