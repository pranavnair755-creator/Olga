$(document).ready(function(){
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    var errorCallback = function(e) {
      console.log('Rejected!', e);
    };

    var hdConstraints = { video: { width: { min: 1280 }, height: { min: 720 } } };

    navigator.mediaDevices.getUserMedia(hdConstraints)
      .then(function(localMediaStream) {
        var video = document.querySelector('video');
        
        // Assign the stream directly to srcObject
        video.srcObject = localMediaStream;

        video.onloadedmetadata = function(e) {
          video.play();
        };
      })
      .catch(errorCallback);
  } else {
    alert('getUserMedia() is not supported in your browser');
  }
});