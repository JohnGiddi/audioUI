(function(){
  var app = angular.module('audioApp', []);

  app.controller('AudioController', ['$scope', '$interval', '$http', '$window', function($scope,$interval,$http,$window){


      // songs playlist
      $scope.playList = [
        { song: "playlist/compton.mp3", description: "N.W.A:  Straight Outta Compton", image: "images/nwa.jpg"},
        { song: "playlist/get_lucky.mp4", description: "Daft Punk:  Get Lucky", image: "images/daftpunk.jpg"},
        { song: "playlist/play_that_funky.mp3", description: "Wild Cherry:  Play That Funky Music", image: "images/wildcherry.jpg"},
        { song: "playlist/standing.m4a", description: "Empire Of The Sun:  Standing On The Shore", image: "images/empireofsun.jpg"}
      ]

      var count = 0; // global variable that allows looping use by setInterval, next, prev functions and audioSelected
      $scope.songCount = 0; // global variable used by number of functions
      $scope.shuffleIndex;
      $scope.audioSource = document.getElementById('audio');
      $scope.songVolume = 1;
      $scope.currentTime;
      $scope.totalTime;
      $scope.seekingTime;
      $scope.isPlaying = false;
      $scope.toLoop = false;
      $scope.toShuffle = false;
      $scope.isDragging = false;
      $scope.showPlaylist = false;
      $scope.songDescription;
      $scope.el = document.getElementsByClassName('pickSong'); // fix this here and line below

      console.log($scope.el);
//


      $interval(function () {
        if($scope.audioSource.ended == true && $scope.songCount < $scope.playList.length - 1){
          if(!$scope.isDragging){
            if($scope.toShuffle == false){
                $scope.songCount += 1;
                $($scope.audioSource).attr('src', $scope.playList[$scope.songCount].song);
                $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
                $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
                $scope.songInfo = $scope.playList[$scope.songCount].description;
                $($scope.el[$scope.songCount]).addClass('listActive').siblings().removeClass('listActive');

                $scope.audioSource.play();
            } else {
                $scope.songCount += 1;
                $scope.shuffleIndex = $scope.shuffleArray[$scope.songCount];
                $($scope.audioSource).attr('src', $scope.playList[$scope.shuffleIndex].song);
                $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.shuffleIndex].image +')');
                $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.shuffleIndex].image +')');
                $scope.songInfo = $scope.playList[$scope.shuffleIndex].description;
                $($scope.el[$scope.shuffleIndex]).addClass('listActive').siblings().removeClass('listActive');

                $('.play_pause').addClass('pause');
                $scope.audioSource.play();
            }
          }
        }
        if($scope.songCount == $scope.playList.length -1 && $scope.audioSource.ended == true && $scope.toLoop == true){
          if(!$scope.isDragging){
            console.log('i\'m looping');
            $scope.loopPlaylist();
            count = 0;
          }
        }
        if($scope.audioSource.ended == true && $scope.songCount == $scope.playList.length -1){
          $('.play_pause').removeClass('pause');
          $scope.isPlaying = false;
        }
        if(!$scope.isDragging){
            var t = $scope.audioSource.currentTime;
            var d = $scope.audioSource.duration;
            var w = t / d * 100;
            var p = document.getElementById('progressMeter').offsetWidth;
            $scope.scrubLeft = (t / d * p) - 5;
        }else {
            $scope.scrubLeft = document.getElementById('thumbScrubber').offsetLeft;
        }
        if($scope.audioSource.ended == true){
            $scope.marqueeRemove();
        } else {
            $scope.marqueeStart();
        }

      }, 100);

      $scope.initPlayer = function(){
          $scope.currentTime = 0;
          $scope.totalTime = 0;
          $scope.songPlay = $scope.playList[$scope.songCount].song;
          $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
          $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
          $scope.songInfo = $scope.playList[$scope.songCount].description;
          $($scope.el[$scope.songCount]).addClass('listActive').siblings().removeClass('listActive');
          $scope.audioSource.addEventListener("timeupdate", $scope.updateTime, true);
          $scope.audioSource.addEventListener("loadedmetadata", $scope.updateData, true);

      };

      $scope.updateTime = function(e){
          if(!$scope.audioSource.seeking){
            $scope.currentTime = e.target.currentTime;
          };
      };

      $scope.updateData = function(e){
          $scope.totalTime = e.target.duration;
      };


      // UPPER AUDIO CONTROLS SHUFFLE, SEEK, LOOP //

      $scope.mouseMoving = function($event){ // refactor this FUCNTION
          if($scope.isDragging && $scope.currentTime <= $scope.totalTime){
              var mX = 0, limitX = $('#progressMeter').width();
              var offset = $('#progressMeter').offset();
              var halfContWidth = $('#progressMeter').width()/2;
              mX = Math.min($event.pageX - offset.left, limitX);
              if (mX < 0) mX = 0;

              $("#thumbScrubber").css({left:mX - 5});

              var w = $('#progressMeter').outerWidth();
              var parentOffset = $('#progressBar').parent().offset();
              var mouseX = $event.pageX - parentOffset.left;
              var d = $scope.audioSource.duration;
              var s = Math.round(mouseX / w * d);
              $scope.audioSource.currentTime = s;
          }
      };

      $scope.dragStart = function($event){
          $scope.isDragging = true;
          $scope.audioSource.pause();
          $("#thumbScrubber").addClass('largeScrubber');
          $('.play_pause').removeClass('pause');
          console.log("dragStart = true");
      };

      $scope.dragStop = function($event){
          if($scope.isDragging){
              $scope.isDragging = false;
              $scope.videoSeek($event);
              $scope.audioSource.play();
              $('.play_pause').addClass('pause');
              $("#thumbScrubber").removeClass('largeScrubber');
              console.log("dragStop = true");
          }
      };

      $scope.videoSeek = function($event){
          var w = $('#progressMeter').outerWidth();
          var parentOffset = $('#progressBar').parent().offset();
          var mouseX = $event.pageX - parentOffset.left;
          var d = $scope.audioSource.duration;
          var s = Math.round(mouseX / w * d);
          $scope.audioSource.currentTime = s;
      };

      // LOOP AND SHUFFLE FUCNTIONS

      $scope.loopPlaylist = function(){
          if ($scope.toShuffle == false){
              $scope.songCount = 0;
              $($scope.audioSource).attr('src', $scope.playList[$scope.songCount].song);
              $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
              $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
              $scope.songInfo = $scope.playList[$scope.songCount].description;
              $($scope.el[$scope.songCount]).addClass('listActive').siblings().removeClass('listActive');
              $scope.audioSource.play();
          }
          if ($scope.toShuffle == true){
              $scope.songCount = 0;
              $scope.shuffleIndex = $scope.shuffleArray[$scope.songCount];
              $($scope.audioSource).attr('src', $scope.playList[$scope.shuffleIndex].song);
              $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.shuffleIndex].image +')');
              $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.shuffleIndex].image +')');
              $scope.songInfo = $scope.playList[$scope.shuffleIndex].description;
              $($scope.el[$scope.shuffleIndex]).addClass('listActive').siblings().removeClass('listActive');
              $('.play_pause').addClass('pause');
              $scope.audioSource.play();
              $scope.isPlaying = true;
              console.log('songcount in loop function = ' + $scope.songCount );
              // return $scope.songCount;
          }
          return $scope.songCount;
      };

      $scope.toggleLoop = function(){
        $('.loop').toggleClass('loopActive');
        if (!$scope.toLoop){
            $scope.toLoop = true;
            console.log('to loop');
        } else {
            $scope.toLoop = false;
            console.log('not to loop');
        }
      };
      // this shuffle function needs to shuffle an aray that will be use a the songCount
      // ex: array = [0,1,2,3] shuffle it equals [2,0,1,3]
      // this way the user can have a shuffle playlist but will keep some order to the songs
      $scope.shufflePlaylist = function() { // refactor this FUCNTION
        if ($scope.toShuffle == true) {
            $scope.shuffleArray = [];
            var currentSong;
                      for (var i = 0; i < $scope.playList.length; i++){
                          $scope.shuffleArray.push(i);
                      }
                      $scope.shuffleArray.sort(function(){ return 0.5 - Math.random()});
                      for (var j = 0; j < $scope.shuffleArray.length; j++){
                        if ($scope.shuffleArray[j] == $scope.songCount){
                          currentSong = j;
                        }
                      }
            var moveToFront = $scope.shuffleArray.splice(currentSong,1);
            $scope.shuffleArray.unshift(moveToFront[0]);
            $scope.songCount = 0;
        }
      };


      $scope.toggleShuffle = function(){
          $('.shuffle').toggleClass('shuffleActive');
          if (!$scope.toShuffle){
              $scope.toShuffle = true;
              console.log('to shuffle');
              $scope.shufflePlaylist();
              console.log($scope.shuffleArray);
              console.log($scope.songCount);
          } else {
              $scope.toShuffle = false;
              console.log('not to shuffle');
              // $scope.songCount = $scope.shuffleIndex;
              // count = $scope.shuffleIndex;
          }
      };

      // LOWER AUDIO CONTROLLERS PLAY, NEXT, PREV //
      $scope.togglePlay = function(count){
          if($scope.audioSource.paused && count == 0){
              $scope.audioSource.play();
              $scope.isPlaying = true;
              $(".play_pause").toggleClass('pause');
              count = 1;
              console.log("playing = " + $scope.isPlaying);
          } else {
              $scope.audioSource.pause();
              $scope.isPlaying = false;
              $(".play_pause").toggleClass('pause');
              count = 0;
              console.log("playing = " + $scope.isPlaying);
          }
      };

      $scope.nextSong = function(){
          if (count < $scope.playList.length){
              count += 1;
          }
          if ($scope.songCount < $scope.playList.length - 1 && $scope.toShuffle == false){
              $scope.songCount += 1;
              $($scope.audioSource).attr('src', $scope.playList[$scope.songCount].song);
              $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
              $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
              $scope.songInfo = $scope.playList[$scope.songCount].description;
              $('.play_pause').addClass('pause');
              $($scope.el[$scope.songCount]).addClass('listActive').siblings().removeClass('listActive');
              $scope.audioSource.play();
              $scope.isPlaying = true;
          }
          if ($scope.songCount < $scope.playList.length - 1 && $scope.toShuffle == true){
                $scope.songCount += 1;
                $scope.shuffleIndex = $scope.shuffleArray[$scope.songCount];
                $($scope.audioSource).attr('src', $scope.playList[$scope.shuffleIndex].song);
                $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.shuffleIndex].image +')');
                $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.shuffleIndex].image +')');
                $scope.songInfo = $scope.playList[$scope.shuffleIndex].description;
                $($scope.el[$scope.shuffleIndex]).addClass('listActive').siblings().removeClass('listActive');
                $('.play_pause').addClass('pause');
                $scope.audioSource.play();
                $scope.isPlaying = true;
                console.log($scope.shuffleIndex + "shuffle_song");
          }


          if (count == $scope.playList.length && $scope.toLoop == true){
              $scope.loopPlaylist();
              count = 0; // allows loop to happen when click next
              console.log('i\'m looping');
          }
          console.log($scope.songCount + "songCount");
          console.log(count + "count");
      };

      // get rid of this function
      $scope.restartSong = function(){
        $scope.audioSource.currentTime = 0;
      };
      // fix this FUCNTION to go back to beginning of song if currentTime > 5s
      // and go to previous song if currentTime is < 5s
      $scope.prevSong = function(){ // refactor this FUCNTION
        if ($scope.songCount > 0 && $scope.toShuffle == false){
            $scope.songCount -= 1;
            count = $scope.songCount;
            $($scope.audioSource).attr('src', $scope.playList[$scope.songCount].song);
            $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
            $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
            $scope.songInfo = $scope.playList[$scope.songCount].description;
            $($scope.el[$scope.songCount]).addClass('listActive').siblings().removeClass('listActive');
            $scope.audioSource.play();
            $scope.isPlaying = true;
            $('.play_pause').addClass('pause');
            if ($scope.songCount == 0){
                $scope.songCount = 0;
            }
        }
        if ($scope.songCount > 0 && $scope.toShuffle == true){
            $scope.songCount -= 1;
            count = $scope.songCount;
            $scope.shuffleIndex = $scope.shuffleArray[$scope.songCount];
            $($scope.audioSource).attr('src', $scope.playList[$scope.shuffleIndex].song);
            $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.shuffleIndex].image +')');
            $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.shuffleIndex].image +')');
            $scope.songInfo = $scope.playList[$scope.shuffleIndex].description;
            $($scope.el[$scope.shuffleIndex]).addClass('listActive').siblings().removeClass('listActive');
            $('.play_pause').addClass('pause');
            $scope.audioSource.play();
            $scope.isPlaying = true;
            console.log($scope.shuffleIndex + "shuffle_song");

            if ($scope.songCount == 0){
                $scope.songCount = 0;
            }
        }
        console.log($scope.songCount + "song");
        console.log(count + "count");
      };


      $scope.marqueeStart = function(){
          $('.songDescription:nth-child(1)').addClass('marquee');
          $('.songDescription:nth-child(2)').addClass('marqueetwo');
      };

      $scope.marqueeRemove = function(){
          $('.songDescription:nth-child(1)').removeClass('marquee');
          $('.songDescription:nth-child(2)').removeClass('marqueetwo');
      };


      $scope.showDetails = function(){
          $scope.showPlaylist = true;
          $scope.marqueeRemove();
          $('.audioPlaylist').css({left: 0, opacity: 1}).fadeIn();
      };

      $scope.hideDetails = function(){
          $scope.marqueeStart();
          $('.audioPlaylist').animate({left: -100 + "%"}, 500, function(){
              $scope.showPlaylist = false;
          });
      };

      $scope.audioSelected = function(i,event){ // count has to be fix here to move with songCount
          $scope.songCount = i;
          $($scope.audioSource).attr('src', $scope.playList[$scope.songCount].song);
          $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
          $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
          $('.play_pause').addClass('pause');
          $(event.target).addClass('listActive').siblings().removeClass('listActive');
          $scope.audioSource.play();
          $scope.isPlaying = true;
          count = i;
      };

      // HELPER FUCNTION TO LIMIT ngREPEAT
      $scope.getNumber = function(num) {
          return new Array(num);
      }

      // INITIALIZE THE AUDIO PLAYER
      $scope.initPlayer();

  }]); // end of controller

  // FILTER TO DISPLAY TIME IN 12 HOUR FORMAT
  app.filter('time', function(){
    return function(seconds){
      var mm = Math.floor(seconds / 60) % 60, ss = Math.floor(seconds) % 60;
      return (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
    }
  });

})(); // END OF SELF CALL CLOSURE


// // volume range function
// $('#slider1').on('mousemove', function(){
//         var audioRange = $('input[type=range]').val();
//         $('#rangeValue').val(audioRange);
//         audioSource.volume = audioRange;
// });
//
