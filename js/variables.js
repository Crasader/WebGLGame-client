//global variables
var savedFrontPage;

//CONNECTION VARIABLES
var socket;
var connectionNum;
var loadRetryTime = 500;

//IMPORTANT VARIABLES
var renderer;
var scene;
var worldCamera;
var worldLight;
var controls;
var holdingCtrl = false;
var map;
var JSONLoader = new THREE.JSONLoader();

//IN-GAME OBJECTS
var character;
var otherCharacterList = new Array();
var otherCharEntityList = new Array();
var particleSystemList = new Array();
var npcArray = new Array();
var itemArray = new Array();
var itemEntityArray = new Array();
var mapObjectsArray = new Array();
var mapObjectsEntityArray = new Array();
var characterInventory = new Array();
var worldPlane;
var currentlyLoadedChunks = new Array(); //holds physical planes
var previouslyLoadedChunks = new Array(); //holds old groundPlanes

//MAP OBJECT VARS
var zVariation = 15;
var chunkSplits = 50;
var maxPeaks = 60;
var maxPeakHeight = 50;
var extremePeakChance = .05;
var extremePeakHeight = maxPeakHeight * 8;
var minPeakHeight = 0;
var minPeakSlope = .01;
var maxPeakSlope = 1;

//GAME STATE/OPTIONS VARIABLES
var MPF = 17; // TODO - Load this value from server in case it changes for some reason
var mapSize;
var MAP_WIDTH;
var MAP_HEIGHT;
var fog = true;
var fogDistance = 5000;
var cameraElevation = 240;
//1A061A
//0x104B7B
//0x8AA2CF
//0x8AA1A7
var fogColor = 0x8AA1A7;
var lastItemUpdate = new Date().getTime();
var MAX_INVENT_SPACE;
var PLAYER_CONST = 0;
var NPC_CONST = 1;

//ROTATION VARIABLES
var theta = Math.PI/2;
var angleChange = Math.PI/72;
var rotating = 0;
var rotatingVertical = 0;

//MOVING VARIABLES
var moveCursor;
var currentPosition = {x:0,y:0};

//CHAT VARIABLES
var chatMessage = "";
var chatFontSize = 14;
var chatDisappearDelay = 4000;
var chatVisibleDistance = 3000;

//SELECTION VARIABLES
var particleSelectionList = new Array();
particleSelectionList.push(0);
var particleSelection = particleSelectionList[0];

//PROPERTIES
var particleProperties;
var itemProperties;
var chunkProperties;
var weaponProperties;
var objectProperties;
var npcProperties;

//EVENTS
var mapObjectEventTypes;

//MODELS
var man;
var dog;
var objs = ["man", "dog", "blob", "goblin", "beanman", "sniper"];
