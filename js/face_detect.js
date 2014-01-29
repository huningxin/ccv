var video = document.querySelector('#live');
var fpsDiv = document.querySelector('#fps');
var canvas = document.querySelector('#overlay');
var context = canvas.getContext('2d');
var targetCanvas = document.querySelector('#target');
var targetContext = target.getContext('2d');

context.strokeStyle = 'white';
context.font="12px Sans";
context.fillStyle = 'white';

var capture_width = 0;
var capture_height = 0;
var canvas_width = canvas.width;
var canvas_height = canvas.height;

var lastCalledTime = null;
var fps = 0.0;

var intervalID = null;

function computeFPS() {
  if(!lastCalledTime) {
     lastCalledTime = new Date().getTime();
     fps = 0.0;
     return;
  }
  var delta = (new Date().getTime() - lastCalledTime) / 1000;
  lastCalledTime = new Date().getTime();
  if (delta == 0) {
    // avoid overflow
    return;
  }
  fps = (fps + 1 / delta) / 2;
}

function showFPS() {
  fpsDiv.innerHTML = 'FPS: ' + fps.toFixed(1);
}
  
function doLiveVideo(stream) {
  var vendorURL = window.URL || window.webkitURL;
  video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
  video.play();
}

function clearCanvas() {
  context.clearRect(0, 0, canvas_width, canvas_height);
};

function drawFace(faces) {
  clearCanvas();

  for (i = 0; i < faces.length; i++) {
    var face = faces[i];
    context.strokeRect(face.x , face.y, face.width, face.height);
  }
}

function complete(faces) {
  computeFPS();
  var drawFunc = drawFace.bind(this, faces);
  requestAnimationFrame(drawFunc);
  var detectFunc = doFaceDetect.bind(this);
  requestAnimationFrame(detectFunc);
}

function doFaceDetect() {
  targetContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, target.width, target.height);
  var faces = ccv.detect_objects({ "canvas" : ccv.grayscale(targetCanvas),
               "cascade" : cascade,
               "interval" : 5,
               "min_neighbors" : 1,
               "async" : false,
               "worker" : 1 });
  complete(faces);
}

function startFaceDetection(video) {
  video.addEventListener( 'loadedmetadata', function ( event ) {
    doFaceDetect();
  });
    
  intervalID = setInterval(showFPS, 1000);
}

navigator.webkitGetUserMedia({
  audio: false,
  video: { "mandatory": { "minWidth": 640,
                          "minHeight": 480}}
}, function(stream) {
  doLiveVideo(stream);
  startFaceDetection(video);
}, function(e) {
  console.log(e);
});
