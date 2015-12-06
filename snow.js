(function () {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  document.body.insertBefore(canvas, document.body.firstChild);

  canvas.style.cssText = 'pointer-events: none; position: fixed; top: 0; left: 0;' +
          'width: 100%; width: 100vw; height: 100%; height: 100vh; z-index: 999999';
  
  // Move to background if there are problems:
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
  var DEPTH = 8,
      UNITS = 100,
      DELTA = 0.015,
      flakes = [];

  // function to reset a flake object
  function resetFlake(flake) {
    flake.px = flake.x = (Math.random() * width - (width * 0.5)) * DEPTH;
    flake.py = flake.y = 0;
    flake.deltaX = (Math.random() - 0.1) * width * 0.5;
    flake.z = DEPTH;
    flake.s = Math.random();   // random seed for each snowflake
  }

  // initial flake setup
  for (var i=0, n; i < UNITS; i++) {
    n = {};
    resetFlake(n);
    flakes.push(n);
  }
  
  (function addFlake() {
    if (UNITS < 200) {
      // add an extra flake each second
      setTimeout(addFlake, 100);
    }
    
    var n = {};
    resetFlake(n);
    flakes.push(n);
    UNITS++;
  }());

  var raq = window.requestAnimationFrame || window.setTimeout;

  // star rendering anim function
  (function renderLoop() {
    raq(renderLoop, 24);
    
    // clear background
    ctx.clearRect(0, 0, width, height);
    
    // update all flakes
    for (var i = 0; i < UNITS; i++) {
      var flake = flakes[i],
          // Calculate position:
          posX = flake.x + Math.sin(flake.z + Math.PI * flake.x) * 32 +
            flake.z * flake.deltaX / DEPTH,
          posY = flake.y - flake.z * height / DEPTH,
          // fog alpha fade in
          alpha = flake.z > DEPTH - 5 ? (DEPTH - flake.z) / 5 : 1,
          // start radius of LOD snowflake
          radius = Math.sin(flake.z * Math.PI / DEPTH) * (DEPTH - 4);
      
      // fade in (fog effect) using alpha value
      ctx.fillStyle = "hsla(0,0%,90%," + alpha + ")";
      ctx.beginPath();
      
      // LOD snowflake graphic
      ctx.save();
      ctx.translate(posX + width / 2, posY);
    
      // randomize the initial snowflake rotation a bit
      ctx.rotate(flake.s * (i % 2 ? 1 : -1) * ((i%3)/2 + 0.1));
      
      // render basic star style snowflake
      for (var m = 0, g, h; m < 6; m++) {
        g = radius/(i % 4 + 2);
        h = radius/(i % 3 + 1);
        
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
          ctx.lineTo(-g, radius-g);
          ctx.lineTo(0, radius-g);
          ctx.lineTo(g, radius-g);
          ctx.fill();
          ctx.rotate(Math.PI / 3);
        }
      }
      
      ctx.restore();
      
      // update flake position and sinewave offset state
      flake.px = posX;
      flake.py = posY;
      flake.z -= DELTA;
      flake.s += Math.random() / 5;
      
      // when flake is out of the view field
      if (flake.z < 0 || flake.px < -width || flake.px > width || flake.py > height) {
        // reset flake
        resetFlake(flake);
      }
    }
  }());
}());
