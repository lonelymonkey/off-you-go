/**
 * All the layers
 walkDownStairs - root layer
     this layer takes care of the main loop, frame rate, overall game flow
 lmsGameEngine.userControl
    this takes care of all the user input layer
    binds eventListener  to change  control
 lmsGameEngine.processor
    this layer updates all the signals (controller to model)
    takes control, model as input  -> mutate model
    it does all the calculation, boundary check , collision detection etc
 lmsGameEngine.renderer
    renderer does all the drawing,
     takes model as input -> creates view
     if there's generic shape libraries, we should install in renderer layer
 lmsGameEngine.model
    data model representation of the game, shouldn't have any functions, just data
     should be mainly updated by processor, and read by renderer
 */
// function lmsGameProcessor() {
// }
// lmsGameProcessor.prototype.update = function(canvas, config, control, model, stageConfig) {
//   console.log('lmsGameProcessor.prototype.update');
// }

;(function(factory) {
  window.lmsGameEngine = factory({});
}(function( lmsGameEngine ) {
  const data = {
    container: null,
    canvas: null,
    canvasUI: null,
    ctx: null,
    stage0Config: null,
    config: {
      availableWidth: 500,
      availableHeight: 500,
      width: 500,
      height: 600,
      maxStairs: 6,
      minimumYBetweenStair: 70,
      minStairDistanceX: 40,
      // this control the spacing of the stair, small number results = average bigger gap between the stairs
      stairSpacing: 0.1,
      stairUnitWidth: 35,
      stiarRisingSpeed: -125,
      // hearts
      hpHealFromHeart: 0.3333,
      heartSize: 15,
      // frame rate control
      tickLength: 5,
      playerSpeedX: 350,
      playerFallAcceleration: 1000,
      // playerFallAcceleration : 0,
      fpsUpdateFrequency: 2000, // in milisecond
      bumpyStairRatio: 0.15,
      heartSpwanChance: 0.1,
      coinSpawnChance: 0.8,
      scorePerCoin: 5,
      scorePerBounce: 10,
      // style here
      statusTextColor: '#fff',
    },
    model: {
      frameRate: 0,
      fpsObj: {},
      shapeObjects: {
      },
      assets: {
      },
    },
    control: {
      // requestAnimationFrame timer , in case if we need cancelAnimationFrame
      stopMain: 0,
      pause: false,
      lastTick: 0,
      lastRender: 0,
      lastfpsUpdate: 0,
      gameOver: false,
    },
  };
  const gameManager = {
    renderer: null,
    processor: {},
    userControl: {},
  };
  const initFunctions = [];

  /**
  * initialize the starting view
  * @param {object} config config object
  * @param {dom} canvas canvas object
  * @param {object} model model object
  */
  function runInit( config, canvas, model ) {
    initFunctions.forEach(( fnc ) => {
      fnc( config, canvas, model );
    });
  }

  /**
  * main loop
  */
  function main() {
    if ( !data.control.pause && !data.control.gameOver ) {
      data.control.stopMain = window.requestAnimationFrame( main );
      // model.shapeObjects.timer[0].state = 'count';
    }
    /* else {
      model.shapeObjects.timer[0].state = 'paused';
    }*/
    const tFrame = window.performance.now();
    const nextTick = data.control.lastTick + data.config.tickLength;
    let numTicks = 0;
    let timeSinceTick = 0;
    // If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
    // If tFrame = nextTick then 1 tick needs to be updated (and so forth).
    // Note: As we mention in summary, you should keep track of how large numTicks is.
    // If it is large, then either your game was asleep, or the machine cannot keep up.
    if (tFrame > nextTick) {
      timeSinceTick = tFrame - data.control.lastTick;
      numTicks = Math.floor( timeSinceTick / data.config.tickLength );
    }
    queueUpdates( numTicks );
    gameManager.renderer.draw( tFrame, data.canvas, data.ctx, data.control, data.model );
    if ( tFrame - data.control.lastfpsUpdate >= data.config.fpsUpdateFrequency ) {
      data.model.frameRate = Math.floor(1000 / (tFrame - data.control.lastRender));
    }
    data.control.lastRender = tFrame;
  }
  /**
  * process data nth time depending on numTicks
  * @param {number} numTicks number of ticks processor needs to process
  */
  function queueUpdates( numTicks ) {
    for (let i=0; i < numTicks; i++) {
      data.control.lastTick = data.control.lastTick + data.config.tickLength; // Now lastTick is this tick.
      gameManager.processor.update(data);
    }
  }
  /**
  * controlInit control signal init
  */
  function controlInit() {
    data.control.lastTick = window.performance.now();
    data.control.lastRender = data.control.lastTick;
  }
  /**
  * createCanvas - create canvas object
  */
  function createCanvas() {
    data.canvas = document.createElement('canvas');
    const availableWidth = data.config.availableWidth;
    const availableHeight = data.config.availableHeight;
    let scaleRatio = 1;
    if ( availableHeight < data.config.height || availableWidth < data.config.width) {
      console.log('do some scaling');
      if ( availableHeight >= availableWidth ) {
        // ratio
        scaleRatio = availableWidth / data.config.width;
        data.canvas.style.width = availableWidth + 'px';
        data.canvas.style.height = (data.config.height * scaleRatio) + 'px';
      } else {
        scaleRatio = availableHeight / data.config.height;
        data.canvas.style.width = (data.config.width * scaleRatio) + 'px';
        data.canvas.style.height = availableHeight + 'px';
      }
    }
    data.canvas.height = data.config.height;
    data.canvas.width = data.config.width;
    data.container.appendChild(data.canvas);
    data.ctx = data.canvas.getContext('2d');
    console.log('scaling canvas ', scaleRatio);
    // ctx.setTransform(scaleRatio, 0, 0, scaleRatio, 0, 0);
    window['ctx'] = data.ctx;
    window['canvas'] = data.canvas;
  }
  /**
  * loadImages - loading all the image assets
  * @param {array} names array of names
  * @param {function} callback callback function after all assets are loaded
  */
  function loadImages(names, callback) {
    let n;
    let name;
    const result = {};
    let count = names.length;
    const onload = function() {
      if (--count == 0) callback(result);
    };
    for (n = 0; n < names.length; n++) {
      name = names[n];
      result[name] = document.createElement('img');
      result[name].addEventListener('load', onload);
      result[name].src = '/assets/images/games/' + name + '.png';
    }
  }

  lmsGameEngine.loadProcessor = function( processor ) {
    gameManager.processor = processor;
    lmsGameEngine.processor = gameManager.processor;
  };

  lmsGameEngine.loadUserControl = function( userControl ) {
    gameManager.userControl = userControl;
    lmsGameEngine.userControl = gameManager.userControl;
  };

  lmsGameEngine.loadRenderer = function( renderer ) {
    gameManager.renderer = renderer;
  };
  lmsGameEngine.installModel = function( m ) {
    data.model = m;
  };
  lmsGameEngine.loadConfig = function( cfg ) {
    cfg = cfg || {};
    data.config = {...data.config, ...cfg};
  };
  lmsGameEngine.installControl = function( ctrl ) {
    if (typeof ctrl.gameOver === 'undefined') {
      ctrl.gameOver = false;
    }
    if (typeof ctrl.pause === 'undefined') {
      ctrl.pause = false;
    }
    data.control = ctrl;
  };
  lmsGameEngine.loadAssets = function( assets, callback ) {
    loadImages(assets, ( results ) => {
      callback( results );
    });
  };
  lmsGameEngine.registerInitFunction = function( func ) {
    initFunctions.splice(0);
    func.forEach(( f ) => {
      initFunctions.push(f);
    });
  };
  lmsGameEngine.load = function( id ) {
    // initializing control signals
    controlInit();
    // saving stage 0 config
    data.stage0Config = {...data.config};
    data.container = document.getElementById(id);
    createCanvas();
    data.model.fpsObj = new LMS_Text({
      text: '', x: canvas.width-60, y: 20, font: '14px sans-serif',
      color: '#0095DD', align: 'left',
    });
    // load user control
    gameManager.userControl.load(data);
    runInit(data);
    main();
  };

  lmsGameEngine.resume = function() {
    controlInit();
    main();
  };
  lmsGameEngine.restart = function() {
    data.control.gameOver = false;
    data.control.pause = true;
    for ( const prop in data.stage0Config) {
      if (data.stage0Config.hasOwnProperty(prop)) {
        data.config[prop] = data.stage0Config[prop];
      }
    }
    controlInit();
    runInit(data);
    main();
  };
  window['gameData'] = data;
  return lmsGameEngine;
}));
