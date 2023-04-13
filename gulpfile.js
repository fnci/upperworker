import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import plumber from 'gulp-plumber';
const { src, dest, watch } = gulp;
const sass = gulpSass(dartSass);

function css(e){
    src('./src/scss/**/*.scss') // Identify the file.
        .pipe( plumber() ) // Go on after an error of css on the terminal.
        .pipe( sass() ) // Compile from the sass dependencies.
        .pipe( dest('build/css')) // Save file in the specified destination.
    e();// callback to advice the final of the function execution.
}
function dev(e){
    watch('./src/scss/**/*.scss', css); /* When the stylesheet change, this function
                                        would watch the css function to compile again. */
                                        /* To view the changes of all files||folders
                                        we use a recursive method with
                                        the asterisk+asterisk/asterisk.ext */
                                        // '**/*.'
    e();
}


export { css, dev };