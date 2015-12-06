(function () {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  document.body.appendChild(canvas);

  canvas.style.cssText = 'pointer-events: none; position: fixed; top: 0; left: 0;' +
          'width: 100%; width: 100vw; height: 100%; height: 100vh; z-index: 999999';

  // Now based on http://js1k.com/2010-xmas/details/879
  
  // get dimensions of window and resize the canvas to fit
  var width, height;

  (window.onresize = function canvasResize(){
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  })();

  // constants and storage for objects that represent snow flake positions
  var DEPTH = 20,
      UNITS = 50,
      Z = 0.015,
      flakes = [];

  // function to reset a flake object
  function resetFlake(f) {
    f.px = f.x = (Math.random() * width - (width * 0.5)) * DEPTH;
    f.py = f.y = (Math.random() * height - (height * 0.2)) * DEPTH;
    f.z = DEPTH;
    f.s = Math.random();   // random seed for each snowflake
  }

  // initial flake setup
  for (var i=0, n; i < UNITS; i++) {
    n = {};
    resetFlake(n);
    flakes.push(n);
  }

  var raq = window.requestAnimationFrame || window.setTimeout;

  // star rendering anim function
  (function renderLoop() {
    raq(renderLoop, 24);
    
    // clear background
    ctx.clearRect(0, 0, width, height);
    
    // update all flakes
    for (var i = 0; i < UNITS; i++) {
      var n = flakes[i],
          xx = n.x + Math.sin(n.z) * 32,
          nx = xx + width / 2,
          yy = n.y / n.z,
          ny = yy,
          // fog alpha fade in
          alpha = n.z > DEPTH - 5 ? (DEPTH - n.z)/5 : 1,
          // start radius of LOD snowflake
          rad = DEPTH - n.z - 4;
      
      // fade in (fog effect) using alpha value
      ctx.fillStyle = "hsla(0,0%,90%," + alpha + ")";
      ctx.beginPath();
      
      // LOD snowflake graphic
      ctx.save();
      ctx.translate(nx, ny);
    
      // randomize the initial snowflake rotation a bit
      ctx.rotate(n.s * (i%2 ? 1 : -1) * ((i%3)/2 + 0.1));
      
      // render basic star style snowflake
      for (var m=0,g=rad/(i%4+2),h=rad/(i%3+1); m<6; m++) {
        ctx.lineTo(-g, h);
        ctx.lineTo(0, rad);
        ctx.lineTo(g, h);
        ctx.lineTo(0, 0);
        ctx.rotate(Math.PI / 3);
      }
      ctx.fill();
      
      // render spikes on each spoke
      if (i % 2 == 0) {
        for (var s = 0, g = rad / (i % 5 + 1); s < 6; s++) {
            ctx.beginPath();
            ctx.moveTo(0, rad);
            ctx.lineTo(-g, rad-g);
            ctx.lineTo(0, rad-g);
            ctx.lineTo(g, rad-g);
            ctx.fill();
            ctx.rotate(Math.PI / 3);
        }
      }
      
      ctx.restore();
      
      // update flake position and sinewave offset state
      n.px = xx;
      n.py = yy;
      n.z -= Z;
      n.s += Math.random() / 5;
      
      // when flake is out of the view field
      if (n.z < Z || n.px < -width || n.px > width || n.py > height) {
        // reset flake
        resetFlake(n);
      }
    }
  }());
}());
