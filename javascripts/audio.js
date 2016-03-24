(function(){
  var app = angular.module('audioApp', []);

  app.controller('AudioController', ['$scope', '$window', '$interval', '$http', function($scope,$window,$interval,$http){


      // songs playlist
      $scope.playList = [
        { song: "playlist/compton.mp3", image: "images/nwa.jpg"},
        { song: "playlist/get_lucky.mp4", image: "images/daftpunk.jpg"},
        { song: "playlist/play_that_funky.mp3", image: "images/wildcherry.jpg"},
        { song: "playlist/standing.m4a", image: "images/empireofsun.jpg"}
      ]
      // $scope.videoSource = $window.videoSource;
      // $scope.titleDisplay = $window.titleDisplay;
      // $scope.videoDescription = $window.videoDescription;
      // audio defaults
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
      $scope.scrubTop = -1000;
      // $scope.scrubLeft = -1000;
      $scope.seekingTime;


      // $http.get('../js/data.json').success(function(data){
      //     $scope.playList = data;
      // });

      $interval(function () {
        if(!$scope.isDragging){
            var t = $scope.audioSource.currentTime;
            var d = $scope.audioSource.duration;
            var w = t / d * 100;
            var p = document.getElementById('progressMeter').offsetLeft + document.getElementById('progressMeter').offsetWidth;
            $scope.scrubLeft = (t / d * p) - 7;
        }else {
            $scope.scrubLeft = document.getElementById('thumbScrubber').offsetLeft;
        }
        $scope.updateLayout();
      }, 100);

      $scope.initPlayer = function(){
          $scope.currentTime = 0;
          $scope.totalTime = 0;
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

      $scope.updateLayout = function(e){

          if(!$scope.$$phase){
              $scope.$apply();
          }
      };

      $scope.togglePlay = function(){
        if($scope.audioSource.paused && count == 0){
            $scope.audioSource.play();
            $scope.isPlaying = true;
            $(".play_pause").toggleClass('pause');
            count = 1;
        } else {
            $scope.audioSource.pause();
            $scope.isPlaying = false;
            $(".play_pause").toggleClass('pause');
            count = 0;
        }
      };

      // $scope.mouseMoving = function($event){
      //     if($scope.isDragging){
      //       $("#thumbScrubber").offset({left:$event.pageX});
      //       var w = document.getElementById('progressMeter').offsetWidth
      //       var d = $scope.audioSource.duration;
      //       var s = Math.round($event.pageX / w * d);
      //       $scope.seekingTime = s;
      //     }
      // };
      //
      // $scope.dragStart = function($event){
      //     $scope.isDragging = true;
      // };
      //
      // $scope.dragStop = function($event){
      //     if($scope.isDragging){
      //         $scope.videoSeek($event);
      //         $scope.isDragging = false;
      //     }
      // };

      $scope.videoSeek = function($event){
          var w = $('#progressMeter').outerWidth();
          var parentOffset = $('#progressBar').parent().offset();
          var mouseX = $event.pageX - parentOffset.left;
          var d = $scope.audioSource.duration;
          var s = Math.round(mouseX / w * d);
          $scope.audioSource.currentTime = s;
      };

      // $("#progressBar").click(function(e){
      //    var parentOffset = $(this).parent().offset();
      //    //or $(this).offset(); if you really just want the current element's offset
      //    var relX = e.pageX - parentOffset.left;
      //    var relY = e.pageY - parentOffset.top;
      //    console.log(relX);
      // });

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




      // $scope.toggleDetails = function(){
      //     if ($scope.showOptions) {
      //         $scope.showOptions = false;
      //     } else {
      //         $scope.showOptions = true;
      //     }
      // };


      // $scope.toggleMute = function(){
      //   if($scope.audioSource.volume == 0.0){
      //       $scope.audioSource.volume = 1.0;
      //       $('#muteBtn').children("span").toggleClass("glyphicon-volume-up");
      //       $('#muteBtn').children("span").toggleClass("glyphicon-volume-off");
      //   } else {
      //       $scope.audioSource.volume = 0.0;
      //       $('#muteBtn').children("span").toggleClass("glyphicon-volume-up");
      //       $('#muteBtn').children("span").toggleClass("glyphicon-volume-off");
      //   }
      // };

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
//
// $('#thumbScrubber').on('mouseover', function(){
//     $('#currentTime').animate({opacity: 1},300);
//     $('#totalTime').animate({opacity: 1},300);
// });
// $('#thumbScrubber').on('mouseout', function(){
//     $('#currentTime').animate({opacity: 0},300);
//     $('#totalTime').animate({opacity: 0},300);
// });
//
//
//
// function timeFilter(seconds){
//     var mm = Math.floor(seconds / 60) % 60, ss = Math.floor(seconds) % 60;
//     return (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss;
// };
