(function(){
    // songs playlist
    var playList = [
      { song: "playlist/compton.mp3", image: "images/compton.jpg"},
      { song: "playlist/get_lucky.mp4", image: "images/daftpunk.jpg"},
      { song: "playlist/play_that_funky.mp3", image: "images/funkymusic.jpg"},
      { song: "playlist/standing.m4a", image: "images/empireofsun.jpg"}
    ]




    // audio defaults
    var count = 0; // global variable that allow looping use by setInterval, next, prev functions
    var songCount = 0; // global variable used by number of functions
    var currentTime = 0;
    var songVolume = .5;
    var audioSource = $('audio')[0];
    var isPlaying = false;
    var toLoop = false;
    var toShuffle = false;


    // set defaults
    $('#slider1').val(songVolume);
    $(audioSource).attr('src', playList[songCount].song);

    setInterval(function () {
        if(audioSource.ended == true && songCount < playList.length - 1){
          songCount += 1;
          count +=1;
          $(audioSource).attr('src', playList[songCount].song);
          audioSource.play();
        }
        if(songCount == playList.length -1 && audioSource.ended == true && toLoop == true){
          console.log('i\'m looping');
          loop();
          count = 0;
        }
        if(audioSource.ended == true && songCount == playList.length -1){
          $('.play_pause').removeClass('pause');
          isPlaying = false;
        }

    }, 200);

    function togglePlay(count) {
        $('.play_pause').on('click', function(event){
            if (audioSource.paused && count === 0){
                audioSource.play();
                isPlaying = true;
                $(this).toggleClass('pause');
                count = 1;
            } else {
                audioSource.pause();
                isPlaying = false;
                $(this).toggleClass('pause');
                count = 0;
            }
        });
    };
    togglePlay(0);

    // function shuffle(count) {
    //
    //       if (count === 1 && isPlaying != true){
    //           var shuff = playList.sort(function() { return 0.5 - Math.random() });
    //           $(audioSourceaudioSource).attr('src', shuff[songCount]);
    //       }
    //       else {
    //           var org = playList = playList.sort();
    //           $(audioSourceaudioSource).attr('src', org[songCount]);
    //           count = 0;
    //       }
    // };

    function activeShuffle(count){
        $('.shuffle').on('click', function(){
            $(this).toggleClass('shuffleActive');
            if (count === 0){
                toShuffle = true;
                count = 1;
                console.log('shuffle');
            } else {
                toShuffle = false;
                count = 0;
                console.log('not to shuffle');
            }
        });
    };
    activeShuffle(0);


    function loop(){
            songCount = 0;
            $(audioSource).attr('src', playList[songCount].song);
            audioSource.play();
            return songCount;
    };

    function activeLoop(count){
        $('.loop').on('click', function(){
            $(this).toggleClass('loopActive');
            if (count === 0){
                toLoop = true;
                count = 1;
            } else {
                toLoop = false;
                count = 0;
            }
        });
    };
    activeLoop(0);

    // next song function // FIX LOOP LOGIC HERE
    $('.next').on('click', function(){
        if (count < playList.length){
            count += 1;
        }
        if (songCount < playList.length - 1){
            songCount += 1;
            $(audioSource).attr('src', playList[songCount].song);
            $('.play_pause').addClass('pause');
            audioSource.play();
            isPlaying = true;
        }
        if (count == playList.length && toLoop == true){
            loop();
            count = 0; // allows loop to happen when click next
            console.log('i\'m looping');
        }
          console.log(songCount + "song");
          console.log(count + "count");
    });
    console.log(playList.length);

    // prev song function
    $('.prev').on('click', function(event){
            audioSource.currentTime = 0;
    });
    $('.prev').on('dblclick', function(event){
        if (songCount > 0){
            songCount -= 1;
            count = songCount;
            $(audioSource).attr('src', playList[songCount].song);
            audioSource.play();
            isPlaying = true;
            $('.play_pause').addClass('pause');
            if (songCount == 0){
                songCount = 0;
            }
        }
        console.log(songCount + "song");
        console.log(count + "count");
    });


    // volume range function
    $('#slider1').on('mousemove', function(){
            var audioRange = $('input[type=range]').val();
            $('#rangeValue').val(audioRange);
            audioSource.volume = audioRange;
    });




})(); // END OF CLOSURE
