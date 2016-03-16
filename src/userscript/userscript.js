// Injected with gulp
var css = '@@import src/style.css';

var style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);
