var DWD = "https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=1.0.0&CQL_FILTER=WARNCELLID%20IN%20(%27809179142%27)&request=GetFeature&typeName=dwd%3AWarnungen_Gemeinden&outputFormat=application%2Fjson"; //Olching
//var DWD = "https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=1.0.0&CQL_FILTER=WARNCELLID%20IN%20(%27809180117%27)&request=GetFeature&typeName=dwd%3AWarnungen_Gemeinden&outputFormat=application%2Fjson"; //Garmisch
//var DWD = "https://maps.dwd.de/geoserver/dwd/ows?service=WFS&version=1.0.0&CQL_FILTER=WARNCELLID%20IN%20(%2780559180117%27)&request=GetFeature&typeName=dwd%3AWarnungen_Gemeinden&outputFormat=application%2Fjson"; //Nix

var ErrorTime = "";
var CurrentDWD;
function GetDWDAlerts(){
    var timestamp = new Date().getTime(); 
    var TimestampHr = $.format.date(timestamp, "ddd, dd. MMMM yyyy HH:mm:ss"); 
    var jqxhr = $.getJSON( DWD+"&tjlnjsdaiof=" + timestamp, function(data) {
        var alerts = data['features'];
        var rvalue = "";
        for (var i = 0; i < alerts.length; i++) {
            var a = alerts[i];
            var onset = new Date(a["properties"]["ONSET"]);
            var expires = new Date(a["properties"]["EXPIRES"]);
            rvalue += `
                <div class="alert severity_`+a["properties"]["SEVERITY"]+`">
                    <h2>`+a["properties"]["HEADLINE"]+`</h2>
                    <p>Von <strong>`+$.format.date(onset, "ddd, dd. MMMM yyyy HH:mm")+`</strong> bis <strong>`+$.format.date(expires, "ddd, dd. MMMM yyyy HH:mm")+`</strong></p>
                    <p>`+a["properties"]["DESCRIPTION"]+`</p>
                </div>
            `;
        }
        if ( rvalue == "" ){
            rvalue += `
                <div class="alert severity_nothing">
                    <h2>Aktuell keine Wetterwarnungen</h2>
                </div>
            `;
        }
        if (CurrentDWD != rvalue){
            CurrentDWD = rvalue;
            console.log(TimestampHr+": New Alerts");
            $( "#Alerts" ).html(rvalue);
        } else {
            console.log(TimestampHr+": No new Alerts")
        }
        if ( ErrorTime != "" ){
            ErrorTime = "";
            var Time = new Date();
            $("#Notification").removeClass("Error");
            $("#Notification").html("Verbindung zum Wetterdienst um "+TimestampHr+" wiederhergestellt.");
            $("#Notification").addClass("OK");
            setTimeout(function(){
                $("#NotificationContainer").hide();
                $("#Notification").removeClass("OK");
            }, 5000);
        }
    })
    .done(function() {
        //console.log( "second success" );
    })
    .fail(function() {
        console.log(TimestampHr+": Error" );
        if ( ErrorTime == "" || ErrorTime == undefined ){
            ErrorTime = new Date();
            $("#NotificationContainer").css('display', 'flex');;
            $("#Notification").html("Keine Verbindung zum Wetterdienst seit "+TimestampHr);
            $("#Notification").addClass("Error");
        }
    })
    .always(function() {
        //console.log( "complete" );
    });
}

function switchToColVar2(){
    console.log("SwitchToColVar2");
    $("#Col1Var2Loading > div").css('transition', 'width 20s linear');
    $("#Col1Var2Loading > div").css('width', '0%');
    $(".Col1Var2").css('visibility', 'visible');
    $(".Col1Var1").css('visibility', 'hidden');
    $("#Col1Var1Loading > div").css('transition', '');
    $("#Col1Var1Loading > div").css('width', '100%');
    setTimeout(switchToColVar1, 20000)
}

function switchToColVar1(){
    console.log("SwitchToColVar1");
    $("#Col1Var1Loading > div").css('transition', 'width 10s linear');
    $("#Col1Var1Loading > div").css('width', '0%');
    $(".Col1Var2").css('visibility', 'hidden');
    $(".Col1Var1").css('visibility', 'visible');
    $("#Col1Var2Loading > div").css('transition', '');
    $("#Col1Var2Loading > div").css('width', '100%');
    setTimeout(switchToColVar2, 10000)
}


function refreshImage(imgElement, imgURL){    
    // create a new timestamp 
    var timestamp = new Date().getTime();  
  
    var el = document.getElementById(imgElement);  
  
    var queryString = "?t=" + timestamp;    
   
    el.src = imgURL + queryString;    
} 
