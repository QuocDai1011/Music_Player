const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const progress = $('#progress');
const togglePlay = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    songs: [
        {
            name: 'Mất Kết Nối',
            singer: 'Dương Domic',
            patht: './asset/music/MatKetNoi.mp3',
            img: './asset/img/mat_ket_noi.jpg'
        },
        {
            name: 'Yêu Em 2 Ngày',
            singer: 'Dương Domic',
            patht: './asset/music/YeuEm2Ngay.mp3',
            img: './asset/img/yeu_em_2ngay.jpg'
        },
        {
            name: 'Em Của Ngày Hôm Qua',
            singer: 'Sơn Tùng M-TP',
            patht: './asset/music/EmCuaNgayHomQua.mp3',
            img: './asset/img/em_cua_ngay_hqua.png'
        },
        {
            name: 'Nắng Ấm Xa Dần',
            singer: 'Sol Silva',
            patht: './asset/music/NangAmXaDan.mp3',
            img: './asset/img/NangAmXaDan.jpg'
        },
        {
            name: '016 Tan Du',
            singer: 'Sơn Tùng M-TP',
            patht: './asset/music/016TANDU.mp3',
            img: './asset/img/016TanDu.jpg'
        },
        {
            name: 'Waiting For You',
            singer: 'Mono',
            patht: './asset/music/MONO.mp3',
            img: './asset/img/MONO.jpg'
        },
        {
            name: '016 Tan Du',
            singer: 'Sơn Tùng M-TP',
            patht: './asset/music/016TANDU.mp3',
            img: './asset/img/016TanDu.jpg'
        },
        {
            name: '016 Tan Du',
            singer: 'Sơn Tùng M-TP',
            patht: './asset/music/016TANDU.mp3',
            img: './asset/img/016TanDu.jpg'
        },
        {
            name: '016 Tan Du',
            singer: 'Sơn Tùng M-TP',
            patht: './asset/music/016TANDU.mp3',
            img: './asset/img/016TanDu.jpg'
        },
        
    ],

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        }) 
    },

    render: function() {
        const htmls = this.songs.map(song => {
            return `
            <div class="song">
                <div class="thumb" style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    handleEvent: function() {
        const cdWidth = cd.offsetWidth;
        const _this = this;
        document.onscroll = function() {
            const srollTop = window.scrollY ||  document.documentElement.srollTop;
            const newCdWidth = cdWidth - srollTop;
            console.log(newCdWidth);
            if(isNaN(newCdWidth)) {
                cd.style.width = cdWidth + 'px';
                cd.style.opacity = 1;
            }else {
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                cd.style.opacity = newCdWidth / cdWidth;
            }
        }

        // xu li dia quay va dung
        const cdThumbAnimate =  cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity 
        })

        cdThumbAnimate.pause();

        //play pause
        togglePlay.onclick = function() {
            if(_this.isPlaying === false) {
                audio.play();
               
            }else {
                audio.pause();
              
            }
        }
        audio.onplay = function() {
            $('.player').classList.add('playing');
            _this.isPlaying = true;
            cdThumbAnimate.play();
        }
        audio.onpause = function() {
            $('.player').classList.remove('playing');
            _this.isPlaying = false;
            cdThumbAnimate.pause();
        }

        //tieens ddoo bai hat 
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // xu li khi tua bai hat
        progress.oninput = function (e) {
            console.log(e.target.value, e.target.value / 100 * audio.duration);
            audio.currentTime = (e.target.value / 100 * audio.duration);
        }

        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.nextSong();
                audio.play();
            }
        }

        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.prevSong();
                audio.play();
            }
        }

        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        audio.onended = function () {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else {
                _this.nextSong();
                audio.play();
            }
            audio.currentTime = 0;
        }
    },

    loadCurrentSong: function() {
        
        heading.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.patht;
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length ) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();
    }
} 

app.start();