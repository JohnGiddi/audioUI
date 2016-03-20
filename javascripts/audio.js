(function(){
    // songs playlist
    var playList = [
      "playlist/compton.mp3",
      "playlist/get_lucky.mp4",
      "playlist/play_that_funky.mp3",
      "playlist/standing.m4a"
    ]

    // audio defaults
    var count = 0;
    var songCount = 0; // global variable used by number of functions
    var currentTime = 0;
    var songVolume = .5;
    var audioSource = $('audio')[0];
    var isPlaying = false;
    var toLoop = false;
    var toShuffle = false;


    // set defaults
    $('#slider1').val(songVolume);
    $(audioSource).attr('src', playList[songCount]);

    setInterval(function () {
        if(audioSource.ended == true && songCount < playList.length - 1){
          songCount += 1;
          $(audioSource).attr('src', playList[songCount]);
          audioSource.play();
        }
        if(songCount == playList.length -1 && audioSource.ended == true && toLoop == true){
          console.log('i\'m looping');
          loop();
        }
        if(audioSource.ended == true && songCount == playList.length -1){
          $('.play_pause').removeClass('pause');
          isPlaying = false;
        }

    }, 200);

    function togglePlay() {
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
    togglePlay();

    // function shuffle(count) {
    //     $('.shuffle').on('click', function(){
    //           $(this).toggleClass('shuffleActive');
    //           count +=1;
    //           if (count === 1 && isPlaying != true){
    //               var shuff = playList.sort(function() { return 0.5 - Math.random() });
    //               $(audioSourceaudioSource).attr('src', shuff[songCount]);
    //           }
    //           else {
    //               var org = playList = playList.sort();
    //               $(audioSourceaudioSource).attr('src', org[songCount]);
    //               count = 0;
    //           }
    //           console.log(count);
    //     });
    // };
    // shuffle(0);

    function loop(){

            songCount = 0;
            $(audioSource).attr('src', playList[songCount]);
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
          if (songCount < playList.length){
              songCount += 1;
              $(audioSource).attr('src', playList[songCount]);
              $('.play_pause').addClass('pause');
              audioSource.play();
              isPlaying = true;
          }
          if (songCount == playList.length && toLoop == true){
              loop();
              console.log('i\'m looping');
          }
          console.log(songCount);
    });



    // volume range function
    $('#slider1').on('mousemove', function(){
          var audioRange = $('input[type=range]').val();
          $('#rangeValue').val(audioRange);
          audioSource.volume = audioRange;
    });


    // prev song function
    $('.prev').on('click', function(event){
          audioSource.currentTime = 0;
    });
    $('.prev').on('dblclick', function(event){
          if (songCount > 0){
              songCount -= 1;
              $(audioSource).attr('src', playList[songCount]);
              audioSource.play();
              isPlaying = true;
              $('.play_pause').addClass('pause');
              if (songCount == 0){
                  songCount = 0;
              }
          }
    });




})(); // END OF CLOSURE
