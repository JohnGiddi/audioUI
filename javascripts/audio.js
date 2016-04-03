(function(){
  var app = angular.module('audioApp', []);

  app.controller('AudioController', ['$scope', '$interval', '$http', '$window', function($scope,$interval,$http,$window){


      // songs playlist
      $scope.playList = [
        { song: "playlist/compton.mp3", description: "N.W.A:  Straight Outta Compton", image: "images/nwa.jpg"},
        { song: "playlist/get_lucky.mp4", description: "Daft Punk:  Get Lucky", image: "images/daftpunk.jpg"},
        { song: "playlist/play_that_funky.mp3", description: "Wild Cherry:  Play That Funky Music", image: "images/wildcherry.jpg"},
        { song: "playlist/standing.m4a", description: "Empire Of The Sun:  Standing On The Shore", image: "images/empireofsun.jpg"},
        { song: "playlist/compton.mp3", description: "N.W.A:  Straight Outta Compton", image: "images/nwa.jpg"},
        { song: "playlist/get_lucky.mp4", description: "Daft Punk:  Get Lucky", image: "images/daftpunk.jpg"},
        { song: "playlist/play_that_funky.mp3", description: "Wild Cherry:  Play That Funky Music", image: "images/wildcherry.jpg"},
        { song: "playlist/standing.m4a", description: "Empire Of The Sun:  Standing On The Shore", image: "images/empireofsun.jpg"}
      ]

      var count = 0; // global variable that allow looping use by setInterval, next, prev functions
      $scope.songCount = 0; // global variable used by number of functions
      $scope.songVolume = .5;
      $scope.audioSource = document.getElementById('audio');
      $scope.isPlaying = false;
      $scope.currentTime;
      $scope.totalTime;
      $scope.toLoop = false;
      $scope.toShuffle = false;
      $scope.isDragging = false;
      $scope.seekingTime;
      $scope.showPlaylist = true;




      // $http.get('../js/data.json').success(function(data){
      //     $scope.playList = data;
      // });

      $interval(function () {
        if($scope.audioSource.ended == true && $scope.songCount < $scope.playList.length - 1){
          if(!$scope.isDragging){
            $scope.songCount += 1;
            $($scope.audioSource).attr('src', $scope.playList[$scope.songCount].song);
            $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
            $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
            $scope.audioSource.play();
            $scope.isPlaying  = true;
          }
        }
        if($scope.songCount == $scope.playList.length -1 && $scope.audioSource.ended == true && $scope.toLoop == true){
          console.log('i\'m looping');
          $scope.loopPlaylist();
          count = 0;
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

      $scope.mouseMoving = function($event){
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
          console.log("dragStart");
      };

      $scope.dragStop = function($event){
          if($scope.isDragging){
              $scope.videoSeek($event);
              $scope.isDragging = false;
              $scope.audioSource.play();
              $('.play_pause').addClass('pause');
              $("#thumbScrubber").removeClass('largeScrubber');
              console.log("dragStop");
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

      $scope.loopPlaylist = function(){
          $scope.songCount = 0;
          $($scope.audioSource).attr('src', $scope.playList[$scope.songCount].song);
          $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
          $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
          $scope.audioSource.play();
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

      // LOWER AUDIO CONTROLLERS PLAY, NEXT, PREV //

      $scope.togglePlay = function(count){
        if($scope.audioSource.paused && count == 0){
            $scope.audioSource.play();
            $scope.isPlaying = true;
            $(".play_pause").toggleClass('pause');
            count = 1;
            console.log(count);
        } else {
            $scope.audioSource.pause();
            $scope.isPlaying = false;
            $(".play_pause").toggleClass('pause');
            count = 0;
            console.log(count);
        }
      };

      $scope.nextSong = function(){
        if (count < $scope.playList.length){
            count += 1;
        }
        if ($scope.songCount < $scope.playList.length - 1){
            $scope.songCount += 1;
            $($scope.audioSource).attr('src', $scope.playList[$scope.songCount].song);
            $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
            $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
            $('.play_pause').addClass('pause');
            $scope.audioSource.play();
            $scope.isPlaying = true;
        }
        if (count == $scope.playList.length && $scope.toLoop == true){
            $scope.loopPlaylist();
            count = 0; // allows loop to happen when click next
            console.log('i\'m looping');
        }
            console.log($scope.songCount + "song");
            console.log(count + "count");
            var el = $('li.pickSong');
            $(el[$scope.songCount]).addClass('listActive').siblings().removeClass('listActive');
      };


      $scope.restartSong = function(){
        $scope.audioSource.currentTime = 0;
      };
      $scope.prevSong = function(){
        if ($scope.songCount > 0){
            $scope.songCount -= 1;
            count = $scope.songCount;
            $($scope.audioSource).attr('src', $scope.playList[$scope.songCount].song);
            $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
            $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
            $scope.audioSource.play();
            $scope.isPlaying = true;
            $('.play_pause').addClass('pause');
            if ($scope.songCount == 0){
                $scope.songCount = 0;
            }
        }
        console.log($scope.songCount + "song");
        console.log(count + "count");
        var el = $('li.pickSong');
        $(el[$scope.songCount]).addClass('listActive').siblings().removeClass('listActive');
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

      $scope.audioSelected = function(i,event){
          $scope.songCount = i;
          $($scope.audioSource).attr('src', $scope.playList[$scope.songCount].song);
          $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
          $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
          $('.play_pause').addClass('pause');
          $(event.target).addClass('listActive').siblings().removeClass('listActive');
          $scope.audioSource.play();
          $scope.isPlaying = true;
      };





      $scope.getNumber = function(num) {
          return new Array(num);
      }

      $scope.initPlayer();

  }]); // end of controller


  app.filter('time', function(){
    return function(seconds){
      var mm = Math.floor(seconds / 60) % 60, ss = Math.floor(seconds) % 60;
      return (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
    }
  });

  // app.directive('active', function() {
  //   return {
  //       link: function(scope,element) {
  //           element.addClass('listActive');
  //       }
  //   };
  // })





})(); // END OF CLOSURE


// // function shuffle(count) {
// //
// //       if (count === 1 && isPlaying != true){
// //           var shuff = playList.sort(function() { return 0.5 - Math.random() });
// //           $(audioSourceaudioSource).attr('src', shuff[songCount]);
// //       }
// //       else {
// //           var org = playList = playList.sort();
// //           $(audioSourceaudioSource).attr('src', org[songCount]);
// //           count = 0;
// //       }
// // };
//
// function activeShuffle(count){
//     $('.shuffle').on('click', function(){
//         $(this).toggleClass('shuffleActive');
//         if (count === 0){
//             toShuffle = true;
//             count = 1;
//             console.log('shuffle');
//         } else {
//             toShuffle = false;
//             count = 0;
//             console.log('not to shuffle');
//         }
//     });
// };
// activeShuffle(0);

// // volume range function
// $('#slider1').on('mousemove', function(){
//         var audioRange = $('input[type=range]').val();
//         $('#rangeValue').val(audioRange);
//         audioSource.volume = audioRange;
// });
//
