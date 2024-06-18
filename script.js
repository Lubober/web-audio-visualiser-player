//FILE DROP
const dropZone = document.querySelector(".dropZone");
const dropContainer = document.querySelector(".drop-file-container");
const playbackContainer = document.querySelector(".playback-container");
const playBtn = document.querySelector("#play-btn");
const waveformContainer = document.querySelector(".waveform-container");
const backBtn = document.querySelector(".back");
const timeDisplay = document.querySelector(".time")

dropZone.addEventListener("dragover", (e) => {
    dropContainer.classList.add("on-drag");
});
dropZone.addEventListener("dragleave", (e) => {
    dropContainer.classList.remove("on-drag");
});

// PROCESS FILE

dropZone.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const audioFile = document.createElement("audio");
    audioFile.src = url;
    insertTitle(file.name);
    dropContainer.classList.add("no-display");
    playbackContainer.classList.remove("no-display");
    waveformContainer.classList.remove("no-display");

    //AUDIOCONTEXT INITIALISATION
    const ctx = new AudioContext();

    const audioSource = ctx.createMediaElementSource(audioFile);
    const analyser = ctx.createAnalyser();
    audioSource.connect(analyser);
    audioSource.connect(ctx.destination);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    //TEST
    // const btn = document.createElement('button')
    // btn.innerText = 'Refresh data'
    // btn.addEventListener('click',()=>{
    //     analyser.getByteFrequencyData(dataArray)
    //     console.log(dataArray)
    // })
    // document.querySelector('body').append(btn)

    // INITIALISE BARS

    const NUMBER_OF_BARS = 50;

    for (let i = 0; i < 50; i++) {
        const bar = document.createElement("div");
        bar.className = "wave";
        bar.setAttribute("id", "bar" + i);
        waveformContainer.appendChild(bar);
        bar.addEventListener("mouseover", () => {
            if (bar.classList.contains("white")) {
                bar.classList.remove("white");
            } else {
                bar.style.background = `rgba(255,255,255,0.7)`;
                bar.classList.add("white");
            }
        });
        bar.addEventListener("click", () => {
            document.querySelectorAll(".wave").forEach((e) => {
                e.classList.remove("white");
            });
        });
    }

    const renderFrame = () => {
        // TIME DISPLAY
        timeDisplay.innerText= `${Math.round(audioFile.currentTime/60)}:${Math.round(audioFile.currentTime%60).toString().padStart(2,'0')}`
        if(audioFile.currentTime==audioFile.duration){
            playBtn.click()
        }
        
        
        
        // DATA MANIPULATION
        analyser.getByteFrequencyData(dataArray);
        const containerHeight = getComputedStyle(
            waveformContainer
        ).height.replace(/px/g, "");
        for (let i = 0; i < NUMBER_OF_BARS; i++) {
            const bar = document.getElementById("bar" + i);
            if (!bar.classList.contains("white")) {
                const height = Math.min(dataArray[i * 10], containerHeight);
                // console.log()
                // console.log(height)
                const currentColor = mapColor(height);
                bar.style.background = currentColor;

                bar.style.height = `${height}px`;
            }
            // console.log(bar.style.height)
        }
        window.requestAnimationFrame(renderFrame);
    };
    renderFrame();

    // const btn = document.createElement("button");
    // btn.innerText = "TEST";
    // btn.addEventListener("click", () => {
    //     // renderFrame()
    //     // mapColor(31)
    // });
    // document.querySelector("body").append(btn);

    // PLAYER

    playBtn.addEventListener("click", (e) => {
        if (playBtn.className == "play") {
            playBtn.innerHTML = "<i class='fa-solid fa-pause'></i>";
            playBtn.className = "pause";
            audioFile.play();
        } else {
            playBtn.innerHTML = "<i class='fa-solid fa-play'></i>";
            playBtn.className = "play";
            audioFile.pause();
            
        }
    });

    backBtn.addEventListener("click", () => {
        audioFile.currentTime = 0;
    });
});

// INSERT HTML ELEMENTS
const insertTitle = (name) => {
    const trackTitle = document.createElement("h1");
    trackTitle.innerText = name.replace(/\....$/g, "");
    document.querySelector(".title-container").append(trackTitle);
};

// COLOR MAPPER
const mapColor = (value) => {
    value = value * 3;
    let r, g, b;
    if (value <= 255) {
        r = 255;
        g = value;
        b = 0;
    } else if (value > 255 && value <= 510) {
        r = 510 - value;
        g = 255;
        b = 0;
    } else if (value > 510) {
        r = 0;
        g = 255;
        b = value - 510;
    }
    return `rgba(${r},${g},${b},0.5)`;
};
