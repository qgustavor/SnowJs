(function(){
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var flakes = [];
    
    document.body.appendChild(canvas);

    canvas.style.cssText = 'pointer-events: none; position: fixed; top: 0; left: 0;'+
        'width: 100%; width: 100vw; height: 100%; height: 100vh; z-index: 999999';

    (window.onresize = function canvasResize(){
        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;
    })();
    
    var raq = window.requestAnimationFrame || window.setTimeout;

    (function renderLoop() {
        raq(renderLoop, 16);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();

        var random = Math.random();
        var distance = 0.05 + 0.95 * random;

        if (flakes.length < 50) {
            flakeArray.push({
                x: 1.5 * canvas.width * Math.random() - .5 * canvas.width,
                y: -9,
                velX: 2 * distance * (Math.random() / 2 + .5),
                velY: (4 + 2 * Math.random()) * distance,
                radius: Math.pow(5 * random, 2) / 5
            });
        }

        for (var i = 0, len = flakes.length; i < len; i++) {
            if (flakes[i].y > canvas.height) {
                flakeArray.splice(i--, 1);
                len--;
            } else {
                update(flakeArray[i]);
            }
        }
    }());
    
    var snowGradient = ctx.createRadialGradient(60,60,0,60,60,60);
    snowGradient.addColorStop(0, 'rgba(255,225,225,1)');
    snowGradient.addColorStop(0.9, 'rgba(225,225,225,.9)');
    snowGradient.addColorStop(1, 'rgba(225,225,225,0)');
    
    function update(t) {
        t.x += t.velX;
        t.y += t.velY;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = snowGradient;
        ctx.fill()
    }
})();
