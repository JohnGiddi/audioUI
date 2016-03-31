(function(){
  var app = angular.module('audioApp', []);

  app.controller('AudioController', ['$scope', '$interval', '$http', function($scope,$interval,$http){


      // songs playlist
      $scope.playList = [
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
      $scope.showPlaylist = false;



      // $http.get('../js/data.json').success(function(data){
      //     $scope.playList = data;
      // });

      $interval(function () {
        if($scope.audioSource.ended == true && $scope.songCount < $scope.playList.length - 1){
          if(!$scope.isDragging){
            $scope.songCount += 1;
            $($scope.audioSource).attr('src', $scope.playList[$scope.songCount].song);
            $('.imageDisplay').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');
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
            $scope.audioSource.play();
            $scope.isPlaying = true;
            $('.play_pause').addClass('pause');
            if ($scope.songCount == 0){
                $scope.songCount = 0;
            }
        }
        console.log($scope.songCount + "song");
        console.log(count + "count");
      };

      $('.nowPlaying').css('background-image', 'url('+ $scope.playList[$scope.songCount].image +')');

      $scope.marqueeStart = function(){
          $('.songDescription:nth-child(1)').addClass('marquee');
          $('.songDescription:nth-child(2)').addClass('marqueetwo');
      };

      $scope.marqueeRemove = function(){
          $('.songDescription:nth-child(1)').removeClass('marquee');
          $('.songDescription:nth-child(2)').removeClass('marqueetwo');
      };


      // $scope.videoSelected = function(i){
      //     $scope.titleDisplay = $scope.playList[i].title;
      //     $scope.videoDescription = $scope.playList[i].description;
      //     $scope.videoSource = $scope.playList[i].path;
      //     $scope.audioSource.load($scope.videoSource);
      //     $scope.isPlaying = false;
      //     $('#playBtn').children("span").toggleClass("glyphicon-play", true);
      //     $('#playBtn').children("span").toggleClass("glyphicon-pause", false);
      //     $scope.showOptions = false;
      // };

      $scope.showDetails = function(){
          $scope.showPlaylist = true;
          $('.audioPlaylist').css({opacity: 1});
      };
      $scope.hideDetails = function(){
          $scope.showPlaylist = false;
          $('.audioPlaylist').css({opacity: 0});
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


})(); // END OF CLOSURE

//

//
//
//
//
// // audio defaults
// var count = 0; // global variable that allow looping use by setInterval, next, prev functions
// var songCount = 0; // global variable used by number of functions
// var currentTime = 0;
// var songVolume = .5;
// var audioSource = $('audio')[0];
// var isPlaying = false;
// var toLoop = false;
// var toShuffle = false;
//
//
// // set defaults
// function initPlayer(){
//   $('#slider1').val(songVolume);
//   $(audioSource).attr('src', playList[songCount].song);
//   $('.imageDisplay').fadeIn(100).css('background-image', 'url('+ playList[songCount].image +')');
//
// };
//
//
// setInterval(function () {
//
//     if(audioSource.ended == true && songCount < playList.length - 1){
//       songCount += 1;
//       count +=1;
//       $(audioSource).attr('src', playList[songCount].song);
//       $('.imageDisplay').css('background-image', 'url('+ playList[songCount].image +')');
//       audioSource.play();
//     }
//     if(songCount == playList.length -1 && audioSource.ended == true && toLoop == true){
//       console.log('i\'m looping');
//       loop();
//       count = 0;
//     }
//     if(audioSource.ended == true && songCount == playList.length -1){
//       $('.play_pause').removeClass('pause');
//       isPlaying = false;
//     }
//
//
//
// }, 200);
//
// function togglePlay(count) {
//     $('.play_pause').on('click', function(event){
//         if (audioSource.paused && count === 0){
//             audioSource.play();
//             isPlaying = true;
//             $(this).toggleClass('pause');
//             count = 1;
//         } else {
//             audioSource.pause();
//             isPlaying = false;
//             $(this).toggleClass('pause');
//             count = 0;
//         }
//     });
// };
// togglePlay(0);
//
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
//
//
// function loop(){
//         songCount = 0;
//         $(audioSource).attr('src', playList[songCount].song);
//         $('.imageDisplay').css('background-image', 'url('+ playList[songCount].image +')');
//         audioSource.play();
//         return songCount;
// };
//
// function activeLoop(count){
//     $('.loop').on('click', function(){
//         $(this).toggleClass('loopActive');
//         if (count === 0){
//             toLoop = true;
//             count = 1;
//             console.log('to loop');
//         } else {
//             toLoop = false;
//             count = 0;
//             console.log('not to loop');
//         }
//     });
// };
// activeLoop(0);
//
// // next song function // FIX LOOP LOGIC HERE
// $('.next').on('click', function(){
//     if (count < playList.length){
//         count += 1;
//     }
//     if (songCount < playList.length - 1){
//         songCount += 1;
//         $(audioSource).attr('src', playList[songCount].song);
//         $('.imageDisplay').css('background-image', 'url('+ playList[songCount].image +')');
//         $('.play_pause').addClass('pause');
//         audioSource.play();
//         isPlaying = true;
//     }
//     if (count == playList.length && toLoop == true){
//         loop();
//         count = 0; // allows loop to happen when click next
//         console.log('i\'m looping');
//     }
//       console.log(songCount + "song");
//       console.log(count + "count");
// });
//
//
// // prev song function
// $('.prev').on('click', function(event){
//         audioSource.currentTime = 0;
// });
// $('.prev').on('dblclick', function(event){
//     if (songCount > 0){
//         songCount -= 1;
//         count = songCount;
//         $(audioSource).attr('src', playList[songCount].song);
//         $('.imageDisplay').css('background-image', 'url('+ playList[songCount].image +')');
//         audioSource.play();
//         isPlaying = true;
//         $('.play_pause').addClass('pause');
//         if (songCount == 0){
//             songCount = 0;
//         }
//     }
//     console.log(songCount + "song");
//     console.log(count + "count");
// });
//
//
// // volume range function
// $('#slider1').on('mousemove', function(){
//         var audioRange = $('input[type=range]').val();
//         $('#rangeValue').val(audioRange);
//         audioSource.volume = audioRange;
// });
//
