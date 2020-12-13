var os = require('os');
var path = require('path');

async function ffmpegTest() {
    console.log('path.sep = ', path.sep)
    let audioPath1 = "C:\\Users\\marti\\Documents\\projects\\electron-auto-updater-test\\FLAC The Hard Workers ‎– Hola! Hola!\\The Hard Workers - A1 - Heroes Welcome.flac";
    let audioPath2 = "C:\\Users\\marti\\Documents\\projects\\electron-auto-updater-test\\MP3 (&(&#(yh(sd\\14 - Maw!.mp3"
    let imgPath = "C:\\Users\\marti\\Documents\\projects\\electron-auto-updater-test\\FLAC The Hard Workers ‎– Hola! Hola!\\cover.jpg";
    let vidFolderPath = "C:\\Users\\marti\\Documents\\projects\\electron-auto-updater-test\\FLAC The Hard Workers ‎– Hola! Hola!";
    let vidTitle = "my awesome title"
    let vidFileFormat = "mp4";
    //let resolutionOptions = (await getResolutionOptions(imgPath))[3];//resolutionOptions = ["450x820", "2232*2131", "2232*2131", "2232*2131"]
    let resolution = "1920x1080";
    let padding = null;
    let backgroundImg = null;
    let vidOutput = `${vidFolderPath}${path.sep}${vidTitle}.${vidFileFormat}`;
    //generateVid(audioPath2, imgPath, vidOutput, resolution, padding, backgroundImg, null)

};

//generate video using image and audio
async function generateVid(audioPath, imgPath, vidOutput, resolution, padding, backgroundImg, updateInfoLocation) {
    return new Promise(async function (resolve, reject) {

        console.log(`generateVid() 
        \n audioPath = ${audioPath}
        \n imgPath = ${imgPath}
        \n vidOutput = ${vidOutput}
        \n resolution = ${resolution}
        \n padding = ${padding}
        \n backgroundImg = ${backgroundImg}
        \n updateInfoLocation = ${updateInfoLocation}`)

        if (updateInfoLocation) {
            console.log('updateInfoLocation found')
            document.getElementById(updateInfoLocation).innerText = `Generating Video: 0%`
        }


        //begin get ffmpeg info
        const ffmpeg = require('fluent-ffmpeg');
        //Get the paths to the packaged versions of the binaries we want to use
        var ffmpegPath = require('ffmpeg-static-electron').path;
        ffmpegPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked')
        var ffprobePath = require('ffprobe-static-electron').path;
        ffprobePath = ffprobePath.replace('app.asar', 'app.asar.unpacked')
        //tell the ffmpeg package where it can find the needed binaries.
        ffmpeg.setFfmpegPath(ffmpegPath);
        ffmpeg.setFfprobePath(ffprobePath);
        //end set ffmpeg info



        ffmpeg()
            .input(imgPath)
            .loop()
            .addInputOption('-framerate 2')
            .input(audioPath)
            .videoCodec('libx264')
            .audioCodec('copy')
            .audioBitrate('320k')
            .videoBitrate('8000k', true)
            .outputOptions([
                '-preset medium',
                '-tune stillimage',
                '-crf 18',
                '-pix_fmt yuv420p',
                '-shortest'
            ])
            .size(resolution)
            //.autopad(padding)
            .on('progress', function (progress) {
                if (progress.percent) {
                    if (updateInfoLocation) {
                        document.getElementById(updateInfoLocation).innerText = `Generating Video: ${Math.round(progress.percent)}%`
                    }
                } else {
                    if (updateInfoLocation) {
                        document.getElementById(updateInfoLocation).innerText = `Generating Video...`
                    }
                }
                console.info(`vid() Processing : ${progress.percent} % done`);
            })
            .on('codecData', function (data) {
                console.log('vid() codecData=', data);
            })
            .on('end', function () {
                if (updateInfoLocation) {
                    document.getElementById(updateInfoLocation).innerText = `Video generated.`
                }
                console.log('vid()  file has been converted succesfully; resolve() promise');
                //resolve();
            })
            .on('error', function (err) {
                if (updateInfoLocation) {
                    document.getElementById(updateInfoLocation).innerText = `Error generating video.`
                }
                console.log('vid() an error happened: ' + err.message, ', reject()');
                //reject(err);
            })
            .output(vidOutput)
            .run();

    })
}

$(document).ready(function () {
    ffmpegTest();
});

$(document).keyup(function (e) {
    if (e.key === "Escape") {
        if ($('#uploadModal').is(':visible')) {
            $('#uploadModal').modal('toggle');
        }

    }
});

let dropArea = document.getElementById('newUploadFilesInput');
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
})
function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
})
function highlight(e) {
    dropArea.classList.add('highlight')
}
;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
})
function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

//handle files drop event
dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
    let dt = e.dataTransfer
    let files = dt.files
    handleFiles(files)
    //([...files]).forEach(previewFile)
}

function handleFiles(files) {
    console.log('handleFiles() ', files)
    for (var fileNum = 0; fileNum < files.length; fileNum++) {
        console.log('file = ', files[fileNum])
        document.getElementById('newUploadFilesDisplay').innerHTML =
            `
        ${document.getElementById('newUploadFilesDisplay').innerHTML} 
        <br> 
        ${files[fileNum].name}
        `;
    }

}

$('#uploadModal').on('hidden.bs.modal', function (e) {
    document.getElementById('newUploadFilesDisplay').innerHTML = "";
})

/*
function previewFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function () {
        let img = document.createElement('img')
        img.src = reader.result
        document.getElementById('gallery').appendChild(img)
    }
}
*/

