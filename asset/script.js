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
const repeatBtn = $('.btn-repeat');
const darkModeBtn = $('.darkMode__icon');

const PLAYER_STORAGE_KEY = 'QuocDaiThichUtThuongLam';


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    isDarkMode: false,
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

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
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${this.currentIndex === index ? 'active':''} darkMode" data-index="${index  }">
                <div class="thumb" style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title darkMode">${song.name}</h3>
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
            // console.log(newCdWidth);
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
            // console.log(e.target.value, e.target.value / 100 * audio.duration);
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
            if(_this.isRepeat) {
                _this.isRepeat = !_this.isRepeat;
                repeatBtn.classList.toggle('active', _this.isRepeat);
            }
            _this.setConfig('isRepeat', _this.isRepeat);
            _this.setConfig('isRandom', _this.isRandom);
        }

        // xu li lap lai 1 song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
            if(_this.isRandom) {
                _this.isRandom = !_this.isRandom;
                randomBtn.classList.toggle('active', _this.isRandom);
            }
            _this.setConfig('isRepeat', _this.isRepeat);
            _this.setConfig('isRandom', _this.isRandom);
        }

        audio.onended = function () {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else if (_this.isRepeat) {
                audio.play();
            }else { 
                _this.nextSong();
                audio.play();
            }
            audio.currentTime = 0;
        }

        //lang nghe hanh vi click vao playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) {
                // xu li click vao song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // xu li click vao option
                if(e.target.closest('.option')) {

                }
            }
        }

        // darkModeBtn.onclick = function() {
        //     _this.isDarkMode = !_this.isDarkMode;
        //     console.log(_this.isDarkMode);
        // }
    },

    loadCurrentSong: function() {
        heading.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.patht;
        this.render();
        this.srollToActiveSong();
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    srollToActiveSong: function() {
        _this = this;
        setTimeout(function() {
            if(_this.currentIndex === 0 || _this.currentIndex === 1) {
                $('.song.active').scrollIntoView( {
                    behavior: 'smooth',
                    block: 'end',
                });
            }else {
                $('.song.active').scrollIntoView( {
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }, 500);
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
        // làm thêm 1 cái mảng chứa những bài hát đã phát để không random lại
    },

    start: function() {
        this.loadConfig();
        this.defineProperties();
        this.handleEvent();
        this.loadCurrentSong();
        this.render();

        //hien thi lan dau 
        randomBtn.classList.toggle('active', _this.isRandom);
        repeatBtn.classList.toggle('active', _this.isRepeat);
    }
} 

app.start();