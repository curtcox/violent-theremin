var appContents = document.querySelector('.app-contents');

function init() {
  appContents.style.display = 'block';

  // create web audio api context
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new AudioContext();

  // create Oscillator and gain node
  var oscillator1 = audioCtx.createOscillator();
  var oscillator2 = audioCtx.createOscillator();
  var oscillator3 = audioCtx.createOscillator();
  var oscillator4 = audioCtx.createOscillator();
  var oscillator5 = audioCtx.createOscillator();
  var oscillator6 = audioCtx.createOscillator();
  var merger = audioCtx.createChannelMerger(3);

  var gainNode = audioCtx.createGain();

  // connect oscillator to gain node to speakers

  oscillator1.connect(merger);
  oscillator2.connect(merger);
  oscillator3.connect(merger);
  oscillator4.connect(merger);
  oscillator5.connect(merger);
  oscillator6.connect(merger);
  merger.connect(gainNode)
  gainNode.connect(audioCtx.destination);

  // create initial theremin frequency and volumn values

  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;

  var minFreq = 50;
  var range   = 200;
  var maxDetune = 100;
  var maxVol = 0.02;

  var initialFreq = 10;
  var initialVol = 0.1;

  // set options for the oscillator

  var type = "square"
  // "sine", "square", "sawtooth", "triangle" and "custom"
  oscillator1.type=type;
  oscillator2.type=type;
  oscillator3.type=type;
  oscillator4.type=type;
  oscillator5.type=type;
  oscillator6.type=type;

  oscillator1.start(0);
  oscillator2.start(0);
  oscillator3.start(0);
  oscillator4.start(0);
  oscillator5.start(0);
  oscillator6.start(0);

  oscillator1.onended = function() { console.log('tone 1 has now stopped playing!');};
  oscillator2.onended = function() { console.log('tone 2 has now stopped playing!');};
  oscillator3.onended = function() { console.log('tone 3 has now stopped playing!');};
  oscillator4.onended = function() { console.log('tone 4 has now stopped playing!');};
  oscillator5.onended = function() { console.log('tone 5 has now stopped playing!');};
  oscillator6.onended = function() { console.log('tone 6 has now stopped playing!');};

  gainNode.gain.value = initialVol;
  gainNode.gain.minValue = initialVol;
  gainNode.gain.maxValue = initialVol;

  // Mouse pointer coordinates

  var CurX;
  var CurY;

  // Get new mouse pointer coordinates when mouse is moved
  // then set new gain and pitch values

  document.onmousemove = updatePage;

  function play(x,y) {
    console.log(x + "," + y);
    oscillator1.frequency.value = x * range + minFreq;
    oscillator2.frequency.value = x * 1.001 * range + minFreq;
    oscillator3.frequency.value = x * 1.003 * range + minFreq;
    oscillator4.frequency.value = x * 1.007 * range + minFreq;
    oscillator5.frequency.value = x * 1.011 * range + minFreq;
    oscillator6.frequency.value = x * 1.013 * range + minFreq;
  }

  function updatePage(e) {
      KeyFlag = false;

      CurX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
      CurY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

      x = CurX/WIDTH;
      y = CurY/HEIGHT;
      play(x,y);
      canvasDraw(x,y);
  }

  // mute button

  var mute = document.querySelector('.mute');

  mute.onclick = function() {
    if(mute.getAttribute('data-muted') === 'false') {
      gainNode.disconnect(audioCtx.destination);
      mute.setAttribute('data-muted', 'true');
      mute.innerHTML = "Unmute";
    } else {
      gainNode.connect(audioCtx.destination);
      mute.setAttribute('data-muted', 'false');
      mute.innerHTML = "Mute";
    };
  }



  // canvas visualization

  function random(number1,number2) {
    var randomNo = number1 + (Math.floor(Math.random() * (number2 - number1)) + 1);
    return randomNo;
  }

  var canvas = document.querySelector('.canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  var canvasCtx = canvas.getContext('2d');

  function canvasDraw(x,y) {
    rX = x * WIDTH;
    rY = y * HEIGHT;
    rC = Math.floor((gainNode.gain.value/maxVol)*30);
    canvasCtx.globalAlpha = 0.2;

    for(i=1;i<=15;i=i+2) {
      canvasCtx.beginPath();
      canvasCtx.fillStyle = 'rgb(' + 100+(i*10) + ',' + Math.floor(x*255) + ',' + Math.floor(y*255) + ')';
      canvasCtx.arc(rX+random(0,50),rY+random(0,50),rC/2+i,(Math.PI/180)*0,(Math.PI/180)*360,false);
      canvasCtx.fill();
      canvasCtx.closePath();
    }
  }

  // clear screen

  var clear = document.querySelector('.clear');

  clear.onclick = function() { canvasCtx.clearRect(0, 0, canvas.width, canvas.height); }

  // keyboard controls

  var body = document.querySelector('body');

  var KeyX = 1;
  var KeyY = 0.01;
  var KeyFlag = false;

  body.onkeydown = function(e) {
    KeyFlag = true;

    // 37 is arrow left, 39 is arrow right,
    // 38 is arrow up, 40 is arrow down

    if(e.keyCode == 37) { KeyX -= 20; }
    if(e.keyCode == 39) { KeyX += 20; }
    if(e.keyCode == 38) { KeyY -= 20; }
    if(e.keyCode == 40) { KeyY += 20; }
    // set max and min constraints for KeyX and KeyY
    if(KeyX < 1)      { KeyX = 1; }
    if(KeyX > WIDTH)  { KeyX = WIDTH; }
    if(KeyY < 0.01)   { KeyY = 0.01; }
    if(KeyY > HEIGHT) { KeyY = HEIGHT; }

    x = KeyX/WIDTH;
    y = KeyY/HEIGHT;
    play(x,y);
    canvasDraw(x,y);
  };

  play(0.5,0.5);
}
