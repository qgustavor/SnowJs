(function () {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  document.body.insertBefore(canvas, document.body.firstChild);

  canvas.style.cssText = 'pointer-events: none; position: fixed; top: 0; left: 0;' +
          'width: 100%; width: 100vw; height: 100%; height: 100vh; z-index: 999999';
  
  // Move to background if is not possible to ignore mouse:
  if (canvas.style.pointerEvents !== 'none') {
    canvas.style.zIndex = 0;
  }

  // Now based on http://js1k.com/2010-xmas/details/879
  
  // get dimensions of window and resize the canvas to fit
  var width, height;

  (window.onresize = function canvasResize(){
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  })();

  // constants and storage for objects that represent snow flake positions
  var units = 0,
      flakes = [];

  // function to reset a flake object
  function resetFlake(flake) {
    flake.r = Math.random() * 5 + 2;
    flake.s = Math.random();
    flake.x = Math.random() * width;
    flake.y = -flake.r * 2;
    flake.vx = Math.random() - 0.45;
    flake.vy = Math.random() + 0.1;
    flake.l = 0;
    return flake;
  }

  // initial flake setup  
  (function addFlake() {
    if (units < 50) {
      setTimeout(addFlake, 200);
    }
    
    flakes.push(resetFlake({}));
    units++;
  }());

  var raq = window.requestAnimationFrame || window.setTimeout;

  // star rendering anim function
  (function renderLoop() {
    raq(renderLoop, 24);
    
    // clear background
    ctx.clearRect(0, 0, width, height);
    
    // update all flakes
    for (var i = 0; i < units; i++) {
      var flake = flakes[i],
          radius = flake.r;
      
      // fade in (fog effect) using alpha value
      ctx.fillStyle = "hsla(0,0%,90%," + (
        (Math.sin(flake.l / 90 + flake.r) * 0.3 + 0.5) // from 0.2 to 0.8
      ) + ")";
      ctx.beginPath();
      
      // LOD snowflake graphic
      ctx.save();
      ctx.translate(flake.x, flake.y);
    
      // randomize the initial snowflake rotation a bit
      ctx.rotate(flake.s * (i % 2 ? 1 : -1) * ((i%3)/2 + 0.1));
      
      // render basic star style snowflake
      for (var m = 0, g, h; m < 6; m++) {
        g = radius / (i % 4 + 2);
        h = radius / (i % 3 + 1);
        
        ctx.lineTo(-g, h);
        ctx.lineTo(0, radius);
        ctx.lineTo(g, h);
        ctx.lineTo(0, 0);
        ctx.rotate(Math.PI / 3);
      }
      ctx.fill();
      
      // render spikes on each spoke
      if (i % 2 == 0) {
        for (var s = 0; s < 6; s++) {
          g = radius / (i % 5 + 1);
          ctx.beginPath();
          ctx.moveTo(0, radius);
          ctx.lineTo(-g, radius - g);
          ctx.lineTo(0, radius - g);
          ctx.lineTo(g, radius - g);
          ctx.fill();
          ctx.rotate(Math.PI / 3);
        }
      }
      
      ctx.restore();
      
      flake.x += flake.vx;
      flake.y += flake.vy;
      flake.vx /= 1 + flake.l / 1e4;
      flake.vx += Math.sin(flake.l / 20 + flake.r) / 50;
      
      flake.vy /= 1 + flake.l / 1e6;
      flake.vy += flake.l / 1e5;
      
      flake.s += Math.random() / 5;
      flake.l++;
      
      // when flake is out of the view field
      if (flake.x < 0 || flake.x > width || flake.y > height + flake.r) {
        // reset flake
        resetFlake(flake);
      }
    }
  }());
}());
