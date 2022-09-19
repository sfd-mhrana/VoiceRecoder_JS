class VoiceRecorder {
    constructor() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log("Get User Media Suported");
        } else {
            console.log("Get User Not Media Suported");
        }

        this.mediaRecorder
        this.stream
        this.chunks = []
        this.isRecording = false;
        this.recordedurl = null

        this.recorderRef = document.querySelector("#recorder")
        this.playerRef = document.querySelector("#player")
        this.startRef = document.querySelector("#start")
        this.stopRef = document.querySelector("#stop")
        this.saverecord = document.querySelector("#saverecord")



        this.startRef.addEventListener(
            "click",
            this.startRecording.bind(this)
        );

        this.stopRef.addEventListener(
            "click",
            this.stopRecordint.bind(this)
        );

        this.saverecord.addEventListener(
            "click",
            this.saveRecording.bind(this)
        );

        this.constraints = {
            audio: true,
            video: false
        }
    }

    //handle access
    handleSucess(stream) {
        this.stream = stream;
        this.stream.oninactive = () => {
            console.log("Stream Ended")
        }

        this.recorderRef.srcObject = this.stream;
        this.mediaRecorder = new MediaRecorder(this.stream);
        this.mediaRecorder.ondataavailable = this.onMediaRecorderDataAvailable.bind(this);
        this.mediaRecorder.onstop = this.onMediaRecorderStop.bind(this)
        this.recorderRef.play();
        this.mediaRecorder.start();
    }

    onMediaRecorderDataAvailable(e) {
        this.chunks.push(e.data);
    }

    onMediaRecorderStop(e) {
        const blob = new Blob(this.chunks, { 'type': 'audio/mp3; codesc=opus' })
        const audioUrl = window.URL.createObjectURL(blob);
        this.recordedurl = audioUrl;
        this.playerRef.src = audioUrl;
        this.saverecord.style.border="2px solid green"
        this.chunks = [];
        this.stream.getAudioTracks().forEach(track => track.stop())
        this.stream = null
    }

    startRecording() {
        if (this.isRecording) return
        this.isRecording = true
        this.recordedurl = null;
        this.startRef.innerHTML = "Recording...."
        this.playerRef.src = '';
        navigator.mediaDevices.getUserMedia(this.constraints)
            .then(this.handleSucess.bind(this))
    }

    stopRecordint() {
        if (!this.isRecording) return
        this.isRecording = false
        this.startRef.innerHTML = "Record"
        this.recorderRef.pause();
        this.mediaRecorder.stop();
    }

    saveRecording() {
        if (this.recordedurl != null) {
            this.saverecord.href = this.recordedurl;
            this.saverecord.download = 'audio_recording.mp3'; //"audioSample.wav";
        } else {
            alert('Record Please')
        }
    }

}


window.VoiceRecorder = new VoiceRecorder();