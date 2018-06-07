var $ = require("jquery");
var THREE = require('three');

import bootstrap from "../node_modules/eppsa-ksm-shared/functions/bootstrap"

import './styles.css';
import * as astragalModel from './models/astragalRemodeled.json';
import jqueryTouch from './jquery.touch';

let gameData;
let gameCallbacks;
let shared;
let color;
let staticURI;

bootstrap((data, callbacks) => {
	console.log(data, callbacks);
	gameData = data.challenge;
	gameCallbacks = callbacks.callbacks;
    shared = data.shared;
    color = data.color;
    staticURI = data.staticServerUri;
    setup();
})

var numberOfRolls;
var definedScore;

var countRolls = 0;
    
var cameraPivot, camera, scene, renderer, ambientLight ;
var geometry, material, mesh, texture, data;
var rollTime = 0;
var lastTime = 0;
var rollX = 0;
var rollY = 0;
var rollZ = 0;
    
var xDown = 0;
var yDown = 0;
    
var lastZ;
    
var inTouchDetect = false;
    
var basePosition;
    
var light;
    
var RollDuration;
    
var approxX = 0.757;
var approxY = 1.359;
var approxZ = 1.082;
    
var currentApproxHeight;
    
var isInRotation = false;
var lastClientX = 0;
var rotX = 0;
    
var currentSide;
    
var useTexture = false;
    
function setup(){
    numberOfRolls = gameData.numberOfTries;
    definedScore = gameData.score.reward;

    $('#current').text("Noch " + numberOfRolls + " Würfe");

    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode("\
    @font-face {\
        font-family: 'Cabin';\
        src: url('" + staticURI + "/fonts/Cabin/Cabin-Regular.ttf');\
    }\
    "));

    document.head.appendChild(newStyle);
    $('#result').text("Wirf den Astragal");

    if(gameData.useScan == "true"){
        useTexture = true;
    }

    gameCallbacks.hideTimeline();

    if (useTexture) {
        var loader = new THREE.BufferGeometryLoader();
        loader.load( "models/astragal.json",  function( d ) {
            data = d;
            var textureLoader = new THREE.TextureLoader();
                textureLoader.load( "models/texture.jpg", function (t ) {
                texture = t;

                init();
            });

        });
    } else {

        var loader = new THREE.BufferGeometryLoader();
        data = loader.parse(astragalModel);
        //loader.load( "models/astragalRemodeled.json",  function( d ) {
            //data = d;

            var textureLoader = new THREE.TextureLoader();
                textureLoader.load( "./models/AstragalTexture.png", function (t ) {
                texture = t;

                init();
            //});

        });
    }
}




function ApproximateHeight( down ) {
    return approxX * Math.abs( down.x ) + approxY * Math.abs( down.y ) + approxZ * Math.abs(down.z ) - 1; 

}

var canRoll = true;

function HandlePointerStart( evt ) {
    
    evt.stopPropagation(); 
    evt.preventDefault();
    if (evt.clientY > (window.innerHeight - 150 ) )  {
        console.log("Start rotation");
        isInRotation = true;
        lastClientX = evt.clientX;
        rotX = 0;
        return;
    }
    if (! canRoll ) return;
    console.log(evt);
    xDown = evt.clientX;
    yDown = evt.clientY;
    inTouchDetect = true;

}

function HandlePointerMove( evt ) {
   
    evt.stopPropagation(); 
    evt.preventDefault();
    if (isInRotation)  {
        rotX = evt.clientX - lastClientX;
        lastClientX = evt.clientX;
        return;
    }
    if (! inTouchDetect ) return;
     var xD = evt.clientX - xDown;
     var yD = evt.clientY - yDown;
     if (yD > 0) return;
     var len = Math.sqrt( xD * xD + yD * yD );
     if (len > 50) {
        roll();
        //inDetection = false;
        canRoll = false;
     }
}

function HandlePointerEnd( evt ) {

    evt.stopPropagation(); 
    evt.preventDefault();
    isInRotation = false;
    inTouchDetect = false;
}



function HandleTouchStart( evt ) {

    evt.stopPropagation(); 
    evt.preventDefault();
    if (! canRoll ) return;
    xDown = evt.changedTouches[0].clientX;
    yDown = evt.changedTouches[0].clientY;
    inTouchDetect = true;

}

function HandleTouchMove( evt ) {

    evt.stopPropagation(); 
    evt.preventDefault();
    if (! inTouchDetect ) return;
     var xD = evt.changedTouches[0].clientX - xDown;
     var yD = evt.changedTouches[0].clientY - yDown;
     if (yD > 0) return;
     var len = Math.sqrt( xD * xD + yD * yD );
     if (len > 50) {
        roll();
        //inDetection = false;
        canRoll = false;
     }
}

function HandleTouchEnd( evt ) {

    evt.stopPropagation(); 
    evt.preventDefault();
    inTouchDetect = false;
}

function randomRoll( ) {
    var r = Math.random() - 0.5;
    if (Math.abs( r ) < 0.3) {
        if (Math.random() > 0.5) r = 0.3;
        else r = - 0.3;
    }
    return 12 * r;
}

var directions;
var down;
var minDownVector;
var currentDownVector;

/*
*  When  Document Ready
*/
$(document).ready( function( ) {
    
});

function roll ( ) {

        rollTime = RollDuration;
        SetRollDirection();
        $("#result").hide();
        $("#points").hide();
        $("#arrowUp").fadeOut(1000);
    }

function SetRollDirection( ) {

        rollX = randomRoll();
        rollY = randomRoll();
        rollZ = randomRoll();
}


/*
*  INITALIZE RENDERER AND SCENE
*/

function init(  ) {

    lastTime = Date.now();
    /*
    * Possible directions the astragal can fall to.
    */
    directions = [ 
        {
            name: "Hyption",
            dir: new THREE.Vector3(  1, 0, 0 ),
            points: "4",
            score: 4
        },
        {

            name: "Pranes",
            dir:  new THREE.Vector3( -1, 0, 0 ),
            points: "3",
            score: 3
        },
        {
            name: "Chion",
            dir: new THREE.Vector3( 0,  1, 0 ),
            points: "1",
            score: 1
        },
        {
            name: "Kyon",
            dir: new THREE.Vector3( 0, -1,0 ),
            points: "6",
            score: 6
        }
    ];
    RollDuration =   Math.PI;
    down = new THREE.Vector3( 0, -1, 0 ),
    basePosition = new THREE.Vector3( 0, 0, 0 );
    minDownVector = new THREE.Vector3( 0, -1, 0 ),
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 30 );

    camera.position.set( 0, 2.8, 8 );

    camera.rotation.x = - 0.05 * Math.PI;
    cameraPivot = new THREE.Object3D();   
    cameraPivot.add( camera );


    light = new THREE.SpotLight( 0xffffff );
    light.intensity = 1.2;
    light.position.set( 0, 5, 5 );
    light.distance = 40;

    cameraPivot.add( light );
    scene = new THREE.Scene();
    scene.add(cameraPivot);
    geometry = new THREE.Geometry().fromBufferGeometry( data );
    var materialParams = null;
    if (useTexture) {
        materialParams = {"map":texture };
    } else {

        materialParams = {
            "map":texture,
            "shininess":15
        };
      /*
      materialParams = {
            "color": 0xf4ecd2
        }
        */
    }
    material = new THREE.MeshPhongMaterial( materialParams );
    mesh = new THREE.Mesh( geometry, material );
    var planeMaterial = new THREE.MeshPhongMaterial( {"color" : 0xd7d7e7, "shininess": 60});
    var plane = new THREE.Mesh(  new THREE.CylinderGeometry( 3, 3, 0.1, 64 ), planeMaterial );
    plane.position.y = - 1;
    
    scene.add( plane );
    scene.add( mesh );


    ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );

    scene.add( ambientLight );


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xfed6a4, 1);


/*
    document.addEventListener("touchdown", HandleTouchStart,false );
    document.addEventListener("touchmove", HandleTouchMove, false );
   document.addEventListener("touchend", HandleTouchEnd, false );
*/

    $(renderer.domElement).touchInit( );

    $(renderer.domElement).on("touch_start", HandlePointerStart );    
   $(renderer.domElement).on("touch_move", HandlePointerMove);
   $(renderer.domElement).on("touch_end", HandlePointerEnd);
/*
    document.addEventListener("pointerdown", HandlePointerStart,false );    
    document.addEventListener("pointermove", HandlePointerMove, false );
   document.addEventListener("pointerup", HandlePointerEnd, false );

*/
    $("#main").append( renderer.domElement );
    animate();

}

/*
*   UPDATE LOOP
*/

function animate() {
    var newTime = Date.now();
    var timeDelta = (newTime - lastTime) / 1000;
    requestAnimationFrame( animate );
    /*
    *   Rotate The scene
    */
    if (isInRotation) {
        cameraPivot.rotation.y -= 2 *  rotX /  window.innerWidth;
       
    }
    /*
    *   Handle rolling
    */ 
    if (rollTime > 0) {

        currentDownVector = new THREE.Vector3( 0, -1, 0 );
        currentDownVector.applyQuaternion( mesh.quaternion );
        currentApproxHeight = ApproximateHeight( currentDownVector );
        var bounceHeight =  ( (Math.abs( rollTime ) + 2) / (RollDuration + 2 )) *   Math.abs( Math.sin( rollTime ) ); 
        var rotFac = 0.5 + 0.5 * bounceHeight;
        mesh.rotation.x += rotFac * timeDelta * rollX;
        mesh.rotation.y += rotFac * timeDelta * rollY;
        mesh.rotation.z += rotFac * timeDelta * rollZ;
       /* 
        if (bounceHeight < 0.00001) {
            SetRollDirection();
        }
        */
        

        mesh.position.y = Math.max( 5 * bounceHeight , currentApproxHeight);

        rollTime -= timeDelta;

        /*
        *   Handle end of rolling.
        */
        if (rollTime <= 0 ) {

            console.log(currentDownVector);
            var minDist = 9999;
            var currentPoints;
            for (var i = 0; i != 4; ++i ) {
                var dist = currentDownVector.distanceTo( directions[i].dir );
                console.log( dist );
                if (dist < minDist) {
                    minDist = dist;
                    minDownVector = directions[i].dir;
                    currentSide =   directions[i].name;
                    currentPoints = directions[i].points;
                }

            }
            /*
            *   Determine the result of the roll and set feedbacks.
            */
            $("#result").text(currentSide);
            $("#result").fadeIn(1500);
            $("#points").text(currentPoints);
            countRolls ++;
            let remaining = numberOfRolls - countRolls;
            if(remaining == 1){
                $('#current').text("Noch " + remaining + " Wurf");
            }else{
                $('#current').text("Noch " + remaining + " Würfe");
            }
            

            setTimeout( function() { 
            
                $("#points").fadeIn(1500);
                console.log(countRolls, numberOfRolls);
                if(countRolls >= numberOfRolls){
                    setTimeout(function(){
                        gameCallbacks.finishChallenge(definedScore);
                    },2000);
                }else{
                    canRoll = true;
                }
            }, 1500);
        } 
    } else {
        /*
        *   if Not currently rolling roll to down side.
        */
            currentDownVector = new THREE.Vector3( 0, -1, 0 );
            currentDownVector.applyQuaternion( mesh.quaternion );

            currentApproxHeight = ApproximateHeight( currentDownVector );
            var downRot = new THREE.Quaternion();
            mesh.position.y = currentApproxHeight;      
           downRot.setFromUnitVectors( minDownVector, down );
           mesh.quaternion.slerp( downRot, 0.05 );
        }

       lastTime = newTime;
     // console.log(currentApproxHeight); 
    renderer.render( scene, camera );

}
