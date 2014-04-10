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

var stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.right = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );
  
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
  stats.update();
  for (i = 0; i < faces.length; i++) {
    var face = faces[i];
    context.strokeRect(face.x , face.y, face.width, face.height);
  }
}

function complete(faces) {
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
    
}

navigator.webkitGetUserMedia({
  audio: false,
  video: { "mandatory": { "minWidth": 320,
                          "minHeight": 240}}
}, function(stream) {
  doLiveVideo(stream);
  startFaceDetection(video);
}, function(e) {
  console.log(e);
});
