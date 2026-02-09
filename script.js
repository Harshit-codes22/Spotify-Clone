let audioPlayer = new Audio();
let currentSong = "";
let songs = [];

let songListContainer = document.querySelector(".song-list-container");
let p = document.querySelector("#play");
let previous = document.querySelector("#previous");
let next = document.querySelector("#next");

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

songs = [
    { name: 'Tere Liye', file: 'Tere Liye.mp3', artist: 'Atif Aslam' },
    { name: 'Saiyyara', file: 'Saiyyara.mp3', artist: 'Faheem Abdullha' },
    { name: 'Labon Ko', file: 'Labon Ko.mp3', artist: 'K.K.' },
    { name: 'Kaun Tujhe', file: 'Kaun Tujhe.mp3', artist: 'Armaan Malik' },
    { name: 'Ishq', file: 'Ishq.mp3', artist: 'Faheem Abdullha' },
    { name: 'Ehsaas', file: 'Ehsaas.mp3', artist: 'Darshan Raval' },
    { name: 'Dhun', file: 'Dhun.mp3', artist: 'Arijit Singh' },
    { name: 'Andaz-e-Karam', file: 'Andaz-e-Karam.mp3', artist: 'Nusrat Fateh Ali Khan' },
    { name: 'Aadat', file: 'Aadat.mp3', artist: 'Atif Aslam' },
    { name: 'Saiyyaraaaa', file: 'Saiyaara Title Track - 320Kbps-(Mr-Jat.in).mp3', artist: 'Faheem Abdullah' }
];


function playSong(songFile) {
    currentSong = songFile;

    if (songFile.includes("/")) {
        audioPlayer.src = `${songFile}`;
    } else {
        audioPlayer.src = `songs/${songFile}`;
    }

    audioPlayer.play();
    p.src = "svg/pause.svg";

    let cleanName = songFile.replace(".mp3", "");
    document.querySelector(".songinfo").innerHTML = cleanName;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}


p.addEventListener("click", () => {
    if (audioPlayer.paused) {
        if (!audioPlayer.src) audioPlayer.src = `songs/${currentSong}`;
        audioPlayer.play();
        p.src = "svg/pause.svg";
    } else {
        audioPlayer.pause();
        p.src = "svg/play.svg";
    }
});

audioPlayer.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
        `${formatTime(audioPlayer.currentTime)} / ${formatTime(audioPlayer.duration)}`;

    document.querySelector(".circle").style.left =
        (audioPlayer.currentTime / audioPlayer.duration) * 100 + "%";
});

document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    audioPlayer.currentTime = (audioPlayer.duration * percent) / 100;
});

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
});
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
});

previous.addEventListener("click", () => {
    let currentIndex = songs.findIndex(song => song.file === currentSong);
    if (currentIndex > 0) {
        playSong(songs[currentIndex - 1].file);
    }
});

next.addEventListener("click", () => {
    let currentIndex = songs.findIndex(song => song.file === currentSong);
    if (currentIndex < songs.length - 1) {
        playSong(songs[currentIndex + 1].file);
    }
});

document.querySelector(".range input").addEventListener("change", (e) => {
    audioPlayer.volume = e.target.value / 100;
    if(audioPlayer.volume > 0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("svg/mute.svg", "svg/volume.svg")
    }
});
// Add eventlistener for mute songs
document.querySelector(".volume>img").addEventListener("click", e=>{
    if(e.target.src.includes("svg/volume.svg")){
        e.target.src = e.target.src.replace("svg/volume.svg", "svg/mute.svg")
        audioPlayer.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
        e.target.src = e.target.src.replace("svg/mute.svg", "svg/volume.svg")
        audioPlayer.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
    }
})


function renderSongs(songArray) {
    songListContainer.innerHTML = "";

    songArray.forEach(song => {
        const songCard = document.createElement('div');
        songCard.classList.add('song-card', 'song');

        songCard.innerHTML = `
            <img src="svg/music.svg" class="invert" />
            <div class="text">
                <div>${song.name}</div>
                <div class="subtext">${song.artist || "Unknown Artist"}</div>
            </div>
            <div class="playnow">
                <img src="svg/play.svg" class="invert" />
            </div>
        `;

        songCard.addEventListener("click", () => {
            playSong(song.file);
        });

        songListContainer.appendChild(songCard);
    });
}
renderSongs(songs);



currentSong = songs[0].file;
audioPlayer.src = `songs/${currentSong}`;
document.querySelector(".songinfo").innerHTML = songs[0].name;
document.querySelector(".songtime").innerHTML = "00:00 / 00:00";


const cards = document.querySelectorAll(".card");

cards.forEach(card => {
    card.addEventListener("click", async () => {
        const album = card.getAttribute("data-album");
        const jsonPath = `${album}/album.json`;



        try {
            const res = await fetch(jsonPath);
            const data = await res.json();

            songs = data.songs.map(song => ({
                ...song,
                file: `${album}/${song.file}`
            }));

            renderSongs(songs);

            if (songs.length > 0) {
                playSong(songs[0].file);
            }

        } catch (err) {
            console.error("Album JSON load error:", err);
        }
    });
});
