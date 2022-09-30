$(document).ready(function(){
    
    $(".nav-tabs a").click(function(){
      $(this).tab('show');
    });
    $('.nav-tabs a').on('shown.bs.tab', function(event){
      
      var x = $(event.target).text();         // active tab
      var y = $(event.relatedTarget).text();  // previous tab
      
      $(".act span").text(x);
      $(".prev span").text(y);
    });

    
  });

  navigator.geolocation.getCurrentPosition(
    function (position) {
       initMap(position.coords.latitude, position.coords.longitude)
    },
    function errorCallback(error) {
       console.log(error)
    }
 );
 function initMap(lat, lng) {

  var myLatLng = {
     lat,
     lng
  };

  var map = new google.maps.Map(document.getElementById('map'), {
     zoom: 15,
     center: myLatLng
  });

  var marker = new google.maps.Marker({
     position: myLatLng,
     map: map,
  });
}

var socket = io.connect();

socket.on('chat', function (data) {
    var msg = data.nick+':'+data.time+':'+data.message;
    $('textarea').val($('textarea').val()+msg+'\n'); 
});

socket.on('userlist', (data)=>{
    data.map((item)=>{
        $('#activeuser').append(`UserId: <strong>${item}<strong><br/>`)
    })
    let total = data.length;
    document.getElementById('listu').innerHTML= total
    $('b').val(total);
})

// Handle UI
$(function() {
    // Set nickname
    $('#nick').on('click', function() {
        socket.emit('nick', $('#nickText').val());
    });
    // Send chat message
    $('#chat').on('click', function() {
        socket.emit('chat', {
            message:$('#chatText').val()
        });
    });
});

var uiusers = sessionStorage.getItem('users');
console.log(uiusers)