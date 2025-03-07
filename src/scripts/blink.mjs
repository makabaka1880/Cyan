var blink = document.getElementById('blink');
setInterval(function() {
    console.log('blink')
    blink.style.opacity = (blink.style.opacity == 0 ? 1 : 0);
}, 500);