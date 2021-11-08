import React from 'react';

export default function CustomizedDialogs( props ) {
  const [open, setOpen] = React.useState(false);

   const takeCamra =()=>  {
    const video = document.querySelector('#videoId');
    const canvas = document.createElement('canvas');
    canvas.width = '100%';
    canvas.height = '100%';


    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);


    //var img = new Image();
    var img = document.getElementById('imageId');
    img.src = canvas.toDataURL();
    //document.body.appendChild(img);

    console.log("test", img);
    var blobBin = atob(img.src.split(',')[1]);
    var array = [];
    for (var i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    var file = new Blob([new Uint8Array(array)], { type: 'image/png' });
    // console.log("file", file);

    canvas.toBlob(blob => {
      const file = new File([blob], "image.png");
      console.log("file", file);
    });

    document.getElementById('videoId').style.display = 'none';

  };

  const loadCamra = () => {

    const video = document.querySelector('#videoId');
    document.getElementById('videoId').style.display = 'block';
    document.getElementById('imageId').src = "";

    function handleSuccess(stream) {
      window.stream = stream; // make stream available to browser console
      video.srcObject = stream;
    }

    function handleError(error) {
      console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
    }

    const constraints = {
      audio: false,
      video: true
    };

    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
    console.log("navigator", navigator);
  }


  return (
    <div>
    <video  id="videoId" playsinline autoplay ></video>
    <img id="imageId" />
    <button id="takeNew" onClick={loadCamra} >Take New</button>
    <button onClick={takeCamra}  id="take">Take Snapshot</button>
  </div>
  );
}
