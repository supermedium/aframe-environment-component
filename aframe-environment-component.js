/* global AFRAME, THREE */

function logPreset () {
  var el = document.querySelector('[environment]');
  var c = el.components['environment'];
  c.logPreset();
  var str = '{';
  for (var i in c.schema){
    if (i == 'preset') continue;
    str += i + ': ';
    switch(c.schema[i].type) {
      case 'boolean': 
      case 'int': 
      case 'number': 
        str += c.data[i]; 
      break;
      case 'color': 
      case 'string': 
        str += '"' + c.data[i] + '"'; 
      break;
      case 'vec3': 
        str += '{ x: ' + c.data[i].x + ', y: ' + c.data[i].y + ', z: ' + c.data[i].z + '}'; 
      break;
    }
    str += ', ';
  }
  str += '}';

  console.log(str)
}

__environment_presets__ = {
      'none' : {},
      'default' : {seed: 1, skyType: "atmosphere", skyColor: "#88c", horizonColor: "#ddd", autoLights: true, sunPosition: { x: 0, y: 1.37, z: -1}, fog: 0.5, flatShading: false, ground: "spikes", groundYScale: 8, groundTexture: "none", groundColor: "#ec8929", groundColor2: "#694439", dressing: "cubes", dressingAmount: 10, dressingColor: "#795449", dressingScale: 1, dressingVariance: { x: 1, y: 1, z: 1}, dressingUniformScale: true, grid: "none", gridColor: "#ccc"}
};


AFRAME.registerComponent('environment', {
  schema: {
    preset: {default: 'none', oneOf: Object.keys(__environment_presets__)},
    //ImFeelingLucky: {default: false}, 
    seed: {type: 'int', default: 1, min: 0, max: 1000},

    skyType: {default: 'atmosphere', oneOf:['color', 'gradient', 'atmosphere']},
    skyColor: {type: 'color', default: '#88c'},
    horizonColor: {type: 'color', default: '#ddd'},
    autoLights: {default: true},
    sunPosition: {type:'vec3', default: '0 1 -1'},
    fog: {type:'float', default: 0.5, min: 0, max: 1},

    flatShading: {default: false},

    ground: {default: 'spikes', oneOf:['none', 'flat', 'hills', 'canyon', 'spikes', 'noise']}, 
    groundYScale: {type: 'float', default: 8, min: 0, max: 50},
    groundTexture: {default: 'none', oneOf:['none', 'checkerboard', 'squares']},
    groundColor:  {type: 'color', default: '#795449'},
    groundColor2: {type: 'color', default: '#694439'},

    dressing: {default: 'cubes', oneOf:['none', 'cubes', 'pyramids', 'cylinders', 'lathe']},
    dressingAmount: {type: 'int', default: 10, min: 0, max: 1000},
    dressingColor:  {type: 'color', default: '#795449'},
    dressingScale: {type: 'float', default: 1, min: 0, max: 100},
    dressingVariance: {type: 'vec3', default: '1 1 1'},
    dressingUniformScale: {default: true},

    grid: {default:'none', oneOf:['none', 'squares', 'crosses', 'spots', 'xlines', 'ylines']},
    gridColor: {type: 'color', default: '#ccc'}
  },

  init: function () {

    this.STAGE_SIZE = 200;

    // assets
    this.conv_table = '!#$%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{¬|}~';
    this.conv_table += '¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ'
    this.conv_table += 'ĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇňŊŋŌōŎŏŐőŒœŔŕŖŗŘřŚśŜŝŞşŠšŢţŤťŦŧŨũŪūŬŭŮůŰűŲųŴŵŶŷŸŹźŻżŽžſ';
    this.conv_table += 'ƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞǟǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿȀȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏȐȑȒȓȔȕȖȗȘșȚțȜȝȞȟȠȡȢȣȤȥȦȧȨȩȪȫȬȭȮȯȰȱȲȳȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏ';
    
    this.assets = {
      stones: {
        vertices : [-148,-453,-18,142,-196,-26,-40,124,-109,36,-835,37,-282,-72,97,-40,-158,170,2,125,87,-174,125,-20,-65,-356,42,83,-555,-147,5,-182,-62,172,123,-12,193,-489,-60,4,-727,97,120,-767,16,39,-704,-88,-27,-801,-16,-16,-211,30,-119,-327,-8,-139,-349,93,213,124,-213,89,-589,-87,-229,-235,122,54,-537,-57,-173,124,11,28,124,-224,-176,124,205,107,-107,41,34,-21,167,110,-52,195,213,-124,88,161,-173,126,232,122,44,99,-202,87,74,-165,152,80,122,48,181,123,188,-99,-410,-79,-104,-690,-14,138,124,2,121,-356,-83,-301,124,113,-223,-282,20,-232,-62,192,151,-230,-208,-17,125,-106,222,-436,-100,50,-276,-211,165,-154,47,23,124,148,253,122,132,-131,124,-79,-110,124,101,-130,-633,81,100,124,-79,104,-713,-56,100,124,83,113,-468,87,-256,124,22,-270,124,194,-117,-265,164,-31,124,-7,-32,-175,-16,-34,124,157,-47,-289,130,128,124,-266,1,-500,-128,265,124,-100,269,-228,-74,89,123,6,113,-404,-7,168,121,7,34,-149,107,95,122,217],
        faces : [0,37,38,53,13,52,1,54,39,13,16,3,16,14,3,14,13,3,4,58,42,4,59,41,5,17,6,6,63,5,19,18,8,9,66,47,47,44,9,10,45,66,10,69,45,11,69,70,70,68,11,68,46,20,1,57,14,14,55,1,2,40,15,15,37,2,38,15,16,17,64,8,7,62,18,18,42,7,19,64,60,60,22,19,12,23,21,23,9,21,9,12,21,68,70,12,22,60,43,43,4,22,70,10,23,0,53,24,24,51,0,47,66,25,25,65,47,26,59,43,43,5,26,27,48,33,28,49,72,28,73,49,31,48,30,30,48,32,32,50,30,31,34,33,34,31,29,29,28,34,27,72,35,35,71,27,29,50,36,36,73,29,0,38,53,0,51,37,52,13,56,1,39,56,1,55,40,1,40,54,2,37,51,13,53,16,16,55,14,14,57,13,4,41,58,5,60,64,5,64,17,6,17,61,7,42,58,8,64,19,19,42,18,18,62,8,9,44,46,47,65,44,11,68,67,20,67,68,46,68,12,57,56,13,1,56,57,2,54,40,15,40,55,16,53,38,38,37,15,15,55,16,17,8,62,62,61,17,7,61,62,19,22,42,20,46,44,20,44,65,12,70,23,23,66,9,9,46,12,22,4,42,43,59,4,23,10,66,70,69,10,24,53,52,25,66,45,26,5,63,43,60,5,27,33,72,27,71,48,30,50,31,32,48,71,33,34,72,33,48,31,34,28,72,29,73,28,35,72,49,29,31,50],
        //v : '-148,-453Ą1ăā2ĉ96Ą2Đą0,124ĉ09,3ē835ĝ7đ8č-7č9ĤĔĉ5ċ7ĕčėĢ8Ĭ17ęĴđĕ-6Ģ-ġĐ4čĠĄ5ňĉ4ĤŀĊħ6ĳĩĖ2ĈĀĳ9ŕĂĜľĕęĨ2ĤīœĽ76Ĥ1Đ3śıŞ8ă-ŠĄ801ĉēŨđ1ŵ3Ľźś3ű-ů1ŪĄ34ĜŘ,2ƄœŞƌĈ8śįśĶđ2śŔĢėč5ŞćĬ5ķ7Ĉėĺŵ2ċĘƗŞĸĐƦƋ0ƛ0ķƴ,4ŻƏŵŨŧ1Ľ5ŗĢƐĉƫŮĖ6ŵĀƤœĐŔĳ2č4ę9ƙ0ŅĤĹŶƛǀ,ųœǑċ8ƻŔĖǆ-ǔĄƸŤśƾŞ69Žĺ3ƪęǏǉłŲŕżǣƧŕǐǾĦƱđƀĄŐĖ9ĳ5ǉŔĽ20ƃŧ2ō0ǍǐǩĞĚĕ5ȍťŹƻĿĮęŋƋƥƫāăȒȥĳȄĀ3ǼĄ7ǬƾƎĖŴĉżȅ3Ƒƻ0ĕưĨĜǭȰƍ-5ƯȽȴņźř6ăƖŰɆȴȖŰıȴ19ƭĸđȠŨŞȮȴĨƆħĸōēƇɖƢǩĬƩɁȸėǴɛƯŇɈŖȨɜƫĀɈĒƙƩȰęƒœĈƯɄ40ŞŧɍœŵĤɧĀƈȵšƛȖƌ7',
        //f : '0,37ā8,53,1Ĉ52ĉĆ4ā9ĉĈ16āĉĖ1ĐĔĐĊėĐ5ą4čĠĒ41ĆĉăĖĬċĉĒ1ąąĒ6Ė4ăķ,4ĐİĀ45,ĵĉĀ6Ħŀ1ĨŅ,7ĀŌŁąňŏĺĖ2ĀĨ5ăĚĉĠŇ,ĤŖŇŀĂŞĄĉŇęīĐąīčıĉĢčřĴĐ6ńĀ2ŭİč2Ĉ2Ĩż,ĒžƁĉŻŉūŖŻčŵĺĈ4ƎŞűŖŷĈĀćŞĐ2ĠĨľīŔŀ2ŀ6ŀĹ2Ė5ĦƎĮƦŞĸą3ŽĢĒ7ŻūƎĒ3Ĩ4ƯĀ3ľƯč3č5ƽƽĨ3ěĈǈāſƂƂƯƙăƴāŢŀ7ſă2ĒǄāĖ3Ė7ŽĒƽąƗƖǇăČēĆęđǬĎ5ƤŖĺƖƙāǩĨĞƗĕĘĆŇĝĠřƐħĆǥŁńĠŁĝīĪŁĨĸǃĲȊįȔģůȗ6čĳĺĐ4ĶīƤĝƇŁǙńīĢĬŐǃǩęĔǯŘŤ5ȝŠǴǾǽƗ3ƯƯřšȶǼ1ăąșŁƋǹǒȎɄȔŸĺŻľĶƙľŴŇƒŞŽĈłĒĦęƊĺɌƍĆĦɕŃŁǠńĽƘĆċŻƢĶƠƧŁƪȇĩ2ăưŋŻǒƺƼĆǆāĤūǇǊĐǓɶƻǌāƙūŻƳƱǔɷĺǎʇǄ'
      }      
    };

    // scale assets (coordinates saved in integers for better compression)
    for(i in this.assets){
      var len = this.assets[i].vertices.length;
      for (var v = 0; v < len; v++) {
        this.assets[i].vertices[v] /= 1000.0;
      }
    }

    // create sky

    this.sky = document.createElement('a-sky');
    this.sky.setAttribute('radius', this.STAGE_SIZE / 2);
    this.sky.setAttribute('theta-length', 110);

    this.stars = null;

    // create ground

    this.groundMaterial = null;
    this.ground = document.createElement('a-entity');
    this.ground.setAttribute('rotation', '-90 0 0');
    this.groundCanvas = null;
    this.groundTexture = null;
    this.groundMaterial = null;
    this.groundGeometry = null;

    this.dressing = document.createElement('a-entity');

    this.gridCanvas = null;
    this.gridTexture = null;
    // create grid
    //this.gridMaterial = new THREE.LineBasicMaterial({color: this.data.gridColor});
    
    // create lights (one ambient hemisphere light, and one directional for the sun)

    this.hemilight = document.createElement('a-entity');
    this.hemilight.setAttribute('position', '0 50 0');
    this.hemilight.setAttribute('light', {
      type: 'hemisphere',
      color: '#CEE4F0',
      intensity: 0.4
    });
    this.sunlight = document.createElement('a-entity');
    this.sunlight.setAttribute('position', this.data.sunPosition);
    this.sunlight.setAttribute('light', {intensity: 0.6});

    // add everything to the scene

    this.el.appendChild(this.hemilight);
    this.el.appendChild(this.sunlight);
    this.el.appendChild(this.ground);
    this.el.appendChild(this.dressing);
    this.el.appendChild(this.sky);
  },

  // returns a fog color from a specified sky type and sun height
  getFogColor: function (skyType, sunHeight) {

    var fogColor;
    if (skyType=='color'){
      fogColor = new THREE.Color(this.data.skyColor);
    }
    else if (skyType=='gradient'){
      fogColor = new THREE.Color(this.data.horizonColor);
    }
    else if (skyType == 'atmosphere')
    {
      //var FOG_COLORS = ['#DBE5E7', '#DAE3E4', '#A7B5B6', '#8D9088', '#6D6A5B', '#4B4231', '#000000'];
      var FOG_RATIOS = [        1,       0.5,      0.22,       0.1,      0.05,     0];
      var FOG_COLORS = ['#C0CDCF', '#81ADC5', '#525e62', '#2a2d2d', '#141616', '#000'];

      if (sunHeight <= 0) return '#000';

      sunHeight = Math.min(1, sunHeight);

      for (var i = 0; i < FOG_RATIOS.length; i++){
        if (sunHeight > FOG_RATIOS[i]){
          var c1 = new THREE.Color(FOG_COLORS[i - 1]);
          var c2 = new THREE.Color(FOG_COLORS[i]);
          var a = (sunHeight - FOG_RATIOS[i]) / (FOG_RATIOS[i - 1] - FOG_RATIOS[i]);
          c2.lerp(c1, a);
          fogColor = c2;
          break;
        }
      }
  
      fogColor.multiplyScalar(0.9);
      fogColor.lerp(new THREE.Color(this.data.groundColor), 0.3);
    }

    return '#'+fogColor.getHexString();
  },

  update: function (oldData) {
    /*
    if (oldData['ImFeelingLucky'] !== undefined && this.data.ImFeelingLucky != oldData.ImFeelingLucky) {
      this.randomizeAll();
    }
    else 
    */
    if (oldData['preset'] !== undefined && this.data.preset != oldData.preset) {
      for (var i in __environment_presets__[this.data.preset]) {
        this.data[i] = __environment_presets__[this.data.preset][i];
      }
    }

    var skyType = this.data.skyType;
    var sunPos = new THREE.Vector3(this.data.sunPosition.x, this.data.sunPosition.y, this.data.sunPosition.z);
    sunPos.normalize();
    if (skyType == 'atmosphere') {
      this.sky.setAttribute('material', {'sunPosition': sunPos});
      this.setStars((1 - Math.max(0, (sunPos.y + 0.08) * 8)) * 2000 );
    }
    if (this.sunlight) {
      this.sunlight.setAttribute('position', this.data.sunPosition);
      this.sunlight.setAttribute('light', {'intensity': 0.1 + sunPos.y * 0.5});
      this.hemilight.setAttribute('light', {'intensity': 0.1 + sunPos.y * 0.5});
      if (skyType != 'atmosphere') {
        // dim down the sky color for the light
        var skycol = new THREE.Color(this.data.skyColor);
        skycol.r = (skycol.r + 1.0) / 2.0;
        skycol.g = (skycol.g + 1.0) / 2.0;
        skycol.b = (skycol.b + 1.0) / 2.0;
        this.hemilight.setAttribute('light', {'color': '#' + skycol.getHexString()});
      }
    } 

    if (!oldData || 
      skyType != oldData.skyType ||
      this.data.skyColor != oldData.skyColor ||
      this.data.horizonColor != oldData.horizonColor) {

      var mat = {};

      if (skyType != oldData['skyType']) {
        mat.shader = {'color': 'flat', 'gradient': 'gradientshader', 'atmosphere': 'skyshader'}[skyType];
        this.stars.setAttribute('visible', skyType == 'atmosphere'); 
      }
      if (skyType == 'color') {
        mat.color = this.dat.askyColor;
        mat.fog = false;
      }
      else if (skyType == 'gradient') {
        mat.topColor = this.data.skyColor;
        mat.bottomColor = this.data.horizonColor;
      }
      else if (skyType == 'atmosphere') {
      }

      this.sky.setAttribute('material', mat);
    }

    if (this.data.fog > 0) {
      this.el.sceneEl.setAttribute('fog', {
        color: this.getFogColor(skyType, sunPos.y), 
        far: (1.01 - this.data.fog) * this.STAGE_SIZE * 2
      });
    }
    else {
      this.el.sceneEl.removeAttribute('fog');
    }

    if (this.data.autoLights !== oldData.autoLights) {
      this.sunlight.setAttribute('visible', this.data.autoLights);
      this.hemilight.setAttribute('visible', this.data.autoLights);
    }

/*    if (!oldData || this.data.gridColor != oldData.gridColor) {
      this.gridMaterial.color = new THREE.Color(this.data.gridColor);
    }
    if (!oldData || (this.data.grid != oldData.grid ||
      this.data.gridSpacing != oldDaat.gridSpacing ||
      this.data.gridSize != oldData.gridSize)) {
      this.updateGrid();
    }
*/
    if (!oldData || 
        this.data.seed != oldData.seed ||
        this.data.ground != oldData.ground ||
        this.data.groundColor != oldData.groundColor ||
        this.data.groundColor2 != oldData.groundColor2 ||
        this.data.groundYScale != oldData.groundYScale ||
        this.data.groundTexture != oldData.groundTexture ||
        this.data.gridColor != oldData.gridColor ||
        this.data.grid != oldData.grid
        ) {
      this.updateGround(this.data.seed != oldData.seed || this.data.ground != oldData.ground);
      if (this.hemilight) this.hemilight.setAttribute('light', {'groundColor': this.data.groundColor});
    }

    if (!oldData ||
        this.data.seed != oldData.seed ||
        this.data.dressing != oldData.dressing ||
        this.data.dressingAmount != oldData.dressingAmount ||
        this.data.dressingScale != oldData.dressingScale ||
        this.data.dressingColor != oldData.dressingColor  ||
        this.data.dressingVariance.x != oldData.dressingVariance.x ||
        this.data.dressingVariance.y != oldData.dressingVariance.y ||
        this.data.dressingVariance.z != oldData.dressingVariance.z ||
        this.data.dressingUniformScale != oldData.dressingUniformScale 
      ) {
      this.updateDressing();
    }

    this.dumpParametersDiff();

  },

  logPreset: function () {
    var str = '{';
    for (var i in this.schema){
      if (i == 'preset') continue;
      str += i + ': ';
      var type = this.schema[i].type;
      if (type == 'vec3') {
        str += '{ x: ' + this.data[i].x + ', y: ' + this.data[i].y + ', z: ' + this.data[i].z + '}'; 
      }
      else if (type == 'string' || type == 'color') {
        str += '"' + this.data[i] + '"'; 
      }
      else {
        str += this.data[i]; 
      }
      str += ', ';
    }
    str += '}';
    console.log(str)
  },

  dumpParametersDiff: function () {
    var dec3 = (v) => Math.floor(v * 1000) / 1000; // trim number to 3 decimals
    var params = [];
    var usingPreset = this.data.preset != 'none' ? __environment_presets__[this.data.preset] : false;

    if (usingPreset) {
      params.push('preset: ' + this.data.preset);
    }

    for (var i in this.schema) {
      if (i == 'preset' || (usingPreset && usingPreset[i] === undefined)) {
        continue;
      }
      var def = usingPreset ? usingPreset[i] : this.schema[i].default;
      var data = this.data[i];
      var type = this.schema[i].type;
      if (type == 'vec3') {
        var coords = def;
        if (typeof(def) == 'string') {
          def = def.split(' ');
          coords = {x: def[0], y: def[1], z: def[2]};
        }
        if (dec3(coords.x) != dec3(data.x) || dec3(coords.y) != dec3(data.y) || dec3(coords.z) != dec3(data.z)) {
          params.push(i + ': ' + dec3(data.x) + ' ' + dec3(data.y) + ' ' + dec3(data.z))
        }
      }
      else {
        if (def != data) {
          if (this.schema[i].type == 'number') {
            data = dec3(data);
          }
          params.push(i + ': ' + data); 
        }
      }
    }
    console.log('%c' + params.join('; '), 'color: #f48;font-weight:bold');
  },

  random: function (x) {
    return parseFloat('0.' + Math.sin(this.data.seed * 9999 * x).toString().substr(7));
  },
/*
  randomizeAll: function() {
    this.data.seed = Math.floor(1 + Math.random() * 1000);
    var discard = ['seed', 'preset', 'autoLights', 'ImFeelingLucky'];
    this.data.autoLights = true;
    for (var i in this.schema){
      if (discard.indexOf(i) != -1) continue;
      var p = this.schema[i];
      switch(p.type){
        case 'boolean': this.data[i] = Math.random() >= 0.5; break;
        case 'int':     this.data[i] = p.min + Math.floor(Math.random() * (p.max * 0.2 - p.min)); break;
        case 'number':  this.data[i] = p.min + Math.random() * (p.max * 0.2 - p.min); break;
        case 'vec3':    this.data[i] = '' + (Math.random() * 20) + ' ' + (Math.random() * 20) + ' ' + (Math.random() * 20); break;
        case 'string':  this.data[i] = p.oneOf[ Math.floor(Math.random() * p.oneOf.length) ]; break;
        //case 'color':  this.data[i] = p.oneOf[ Math.floor(Math.random() * p.oneOf.length) ]; break;
      }
    }
  },
*/
  updateGround: function (updateGeometry) {

    var resolution = 64;
    // update ground geometry

    if (updateGeometry) {
      var visibleground = this.data.ground != 'none';
      this.ground.setAttribute('visible', visibleground);
      if (!visibleground) return;

      if (!this.groundGeometry) this.groundGeometry = new THREE.PlaneGeometry(this.STAGE_SIZE + 2, this.STAGE_SIZE + 2, resolution - 1, resolution - 1);
      var perlin = new PerlinNoise(this);
      var verts = this.groundGeometry.vertices;
      var numVerts = this.groundGeometry.vertices.length;
      var frequency = 10;
      var inc = frequency / resolution;

      for (var i = 0, j = 0, x = 0, y = 0; i < numVerts; i++) {
        if (this.data.ground == 'flat') {
          verts[i].z = 0; 
          continue;
        }

        var h; 
        switch (this.data.ground) {
          case 'hills':
            h = Math.max(0, perlin.noise(x, y, 0));
          break;
          case 'canyon':
            h = 0.2 + perlin.noise(x, y, 0) * 0.8;
            h = Math.min(1, Math.pow(h, 2) * 10);
          break;
          case 'spikes':
            h = this.random(i) < 0.02 ? this.random(i + 1) : 0;
          break;
          case 'noise':
            h = this.random(i) < 0.35 ? this.random(i + 1) : 0;
          break;
        }

        h += this.random(i + 2) * 0.1; // add some randomness

        // calculate next x,y ground coordinates
        x += inc;
        if (x >= 10) {
          x = 0;
          y += inc;
        }

        // flat ground in the center
        var xx = x * 2 / frequency - 1; 
        var yy = y * 2 / frequency - 1; 
        xx = Math.max(0, Math.min(1, (Math.abs(xx) - 0.1) * 5 ))
        yy = Math.max(0, Math.min(1, (Math.abs(yy) - 0.1) * 5 ))
        h *= xx > yy ? xx : yy;

        // set height
        verts[i].z = h;
      }

      this.groundGeometry.computeFaceNormals();
      this.groundGeometry.computeVertexNormals();
      this.groundGeometry.verticesNeedUpdate = true;
      this.groundGeometry.facesNeedUpdate = true;
      this.groundGeometry.normalsNeedUpdate = true;
    }

    this.ground.setAttribute('scale', {z: this.data.groundYScale});

    // update ground texture

    var texResolution = 512;

    if (!this.groundCanvas || this.groundCanvas.width != texResolution) {
      this.gridCanvas = document.createElement('canvas');
      this.gridCanvas.width = texResolution;
      this.gridCanvas.height = texResolution;
      this.gridTexture = new THREE.Texture(this.gridCanvas);
      this.gridTexture.wrapS = THREE.RepeatWrapping;
      this.gridTexture.wrapT = THREE.RepeatWrapping;
      //this.gridTexture.anisotropy  = this.el.sceneEl.renderer.getMaxAnisotropy();
      this.groundCanvas = document.createElement('canvas');
      this.groundCanvas.width = texResolution;
      this.groundCanvas.height = texResolution;
      this.groundTexture = new THREE.Texture(this.groundCanvas);
      this.groundTexture.wrapS = THREE.RepeatWrapping;
      this.groundTexture.wrapT = THREE.RepeatWrapping;
      this.groundMaterial = new THREE.MeshLambertMaterial({
        map: this.groundTexture,
        emissive: new THREE.Color(0xFFFFFF),
        emissiveMap: this.gridTexture,
        wireframe: false
      });
    }

    this.groundMaterial.shading = this.data.flatShading ? THREE.FlatShading : THREE.SmoothShading;

    var texrepeat = 50;

    var res2 = texResolution / 2;
    var ctx = this.groundCanvas.getContext('2d');
    ctx.fillStyle = this.data.groundColor;
    ctx.fillRect(0, 0, texResolution, texResolution);
    if (this.data.groundTexture == 'checkerboard') {
      ctx.fillStyle = this.data.groundColor2;
      ctx.fillRect(0, 0, res2, res2);
      ctx.fillRect(res2, res2, res2, res2);
    }
    else if (this.data.groundTexture == 'squares') {
      var numSquares = 8;
      var squareSize = texResolution / numSquares;
      var col1 = new THREE.Color(this.data.groundColor);
      var col2 = new THREE.Color(this.data.groundColor2);
      for (var i = 0; i < numSquares * numSquares; i++) {
        var col = this.random(i + 3) > 0.5 ? col1.clone() : col2.clone();
        col.addScalar(this.random(i + 3) * 0.1 - 0.05);
        ctx.fillStyle = '#' + col.getHexString();
        ctx.fillRect((i % numSquares) * squareSize, Math.floor(i / numSquares) * squareSize, squareSize, squareSize);
      }
    }
//    console.log(this.groundCanvas);

    this.drawGrid(ctx, texResolution)

    var gridctx = this.gridCanvas.getContext('2d');
    gridctx.fillStyle = '#000';
    gridctx.fillRect(0, 0, texResolution, texResolution);
    this.drawGrid(gridctx, texResolution)

    this.groundTexture.repeat.set(texrepeat, texrepeat);
    this.groundTexture.needsUpdate = true;
    this.gridTexture.repeat.set(texrepeat, texrepeat);
    this.gridTexture.needsUpdate = true;

    if (updateGeometry) {
      var mesh = new THREE.Mesh(this.groundGeometry, this.groundMaterial)
      this.ground.setObject3D('mesh', mesh);
    }
    else {
      this.ground.getObject3D('mesh').material = this.groundMaterial;
    }
  },

  drawGrid: function (ctx, resolution) {
    if (this.data.grid == 'none') return;
    var res = resolution;
    var res2 = res / 2;
    ctx.fillStyle = this.data.gridColor;
    switch (this.data.grid) {
      case 'squares':
        ctx.fillRect(0, 0, res, 1);
        ctx.fillRect(res2, 0, 1, res);
        ctx.fillRect(0, 0, 1, res);
        ctx.fillRect(0, res2, res, 1);
      break;
      case 'crosses':
        var l = 40;
        var l2 = 20;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(0, 0, 3, 3);
        ctx.fillRect(0, res2, 3, 3);
        ctx.fillRect(res2, 0, 3, 3);
        ctx.fillRect(res2, res2, 3, 3);
        
        ctx.globalAlpha = 1;
        
        ctx.fillRect(0, 1, l2 - 1, 1);
        ctx.fillRect(1, 0, 1, l2 - 1);
        ctx.fillRect(res - l2 + 3, 1, l2 - 2, 1);
        ctx.fillRect(1, res - l2 + 3, 1, l2 - 2);

        ctx.fillRect(res2 - l2 + 1, 1, l, 1);
        ctx.fillRect(res2 + 1, 0, 1, l2 - 1);
        ctx.fillRect(res2 + 1, res - l2 + 3, 1, l2 - 2);

        ctx.fillRect(1, res2 - l2 - 1, 1, l);
        ctx.fillRect(1, res2 + 1, l2 - 1, 1);
        ctx.fillRect(res - l2 + 3, res2 + 1, l2 - 2, 1);

        ctx.fillRect(res2 - l2 + 1, res2 + 1, l, 1);
        ctx.fillRect(res2 + 1, res2 - l2 + 1, 1, l);

      break;
      case 'spots':
        function circle(ctx, x, y, r) {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 2 * Math.PI);
          ctx.fill();
        }
        circle(ctx, 2, 2, 2);
        circle(ctx, res2 + 2, 2, 2);
        circle(ctx, 2, res2 + 2, 2);
        circle(ctx, res2 + 2, res2 + 2, 2);
      break;
      case 'xlines':
        ctx.fillRect(0, 0, res, 1);
        ctx.fillRect(0, res2, res, 1);
      break;
      case 'ylines':
        ctx.fillRect(res2, 0, 1, res);
        ctx.fillRect(0, 0, 1, res);
      break;
    }
  },

  updateDressing: function () {
    var dressing = new THREE.Object3D();
    this.dressing.setAttribute('visible', this.data.dressing != 'none');
    if (this.data.dressing == 'none') {
      return;
    }
    
    function getAssetGeometry(data) {
      if (!data) return null;
      var g = new THREE.Geometry();
      for (var v = 0; v < data.vertices.length; v += 3) {
        g.vertices.push(new THREE.Vector3(data.vertices[v], data.vertices[v + 1], data.vertices[v + 2]));
      }
      for (var f = 0; f < data.faces.length; f += 3) {
        g.faces.push(new THREE.Face3( data.faces[f], data.faces[f + 1], data.faces[f + 2]))
      }
      g.computeFaceNormals();
      return g;
    }

    var geometry = new THREE.Geometry(); // mother geometry that will hold all instances
    var faceindex = ['a','b','c'];

    var treedata = [];

    // get geometry
    var geo;
    var color = new THREE.Color(0xFFFFFF).multiplyScalar(1 - this.random(66) * 0.3);
    switch (this.data.dressing){
      case 'cubes':
        geo = new THREE.BoxGeometry(1, 1, 1);
        geo.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
      break;
      case 'pyramids':
        geo = new THREE.ConeGeometry(1, 1, 4, 1, true);
        geo.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
      break;
      case 'cylinders':
        geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 8, 1, true);
        geo.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
      break;
      case 'lathe':
        var points = [];
        for ( var i = 0; i < 10; i ++ ) {
          points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
        }
        geo = new THREE.LatheGeometry(points);
      break;
      default:
        geo = getAssetGeometry(this.assets[this.data.dressing]);
        if (!geo) return;
      break;
    }

    for (var i = 0, r = 88343; i < this.data.dressingAmount; i++, r++) {
    
      // set vertex colors
      for (var f = 0, fl = geo.faces.length; f < fl; f++) {
        var face = geo.faces[f];
        for (var v = 0; v < 3; v++) {
          //p = geo.vertices[ face[ faceindex[v] ] ]; // get vertex position
          face.vertexColors[v] = color.clone().multiplyScalar(1 - this.random(r * f * v) * 0.1);
        }
      }

      // set random position, rotation and scale
      var ds = this.data.dressingScale;
      var dv = new THREE.Vector3(this.data.dressingVariance.x, this.data.dressingVariance.y, this.data.dressingVariance.z);
      var distance = 10 + Math.max(dv.x, dv.z) + 10 * this.random(r + 1) + this.random(r + 2) * this.STAGE_SIZE / 3;
      var direction = this.random(r + 3) * Math.PI * 2; 
      var matrix = new THREE.Matrix4();
      var scale = this.random(r + 4);
      var uniformScale = this.data.dressingUniformScale;

      matrix.compose(
        // position
        new THREE.Vector3(
          Math.cos(direction) * distance, 
          0, 
          Math.sin(direction) * distance
          ),
        // rotation
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0), 
          (this.random(r + 5) - 0.5) * dv.length() * Math.PI * 2
          ),
        // scale
        new THREE.Vector3(
           ds + (uniformScale ? scale : this.random(r + 6)) * dv.x,
           ds + (uniformScale ? scale : this.random(r + 7)) * dv.y,
           ds + (uniformScale ? scale : this.random(r + 8)) * dv.z
          )
        );

      // merge with dressing mother geometry
      geometry.merge(geo, matrix);
    }

    // convert geometry to buffergeometry
    var bufgeo = new THREE.BufferGeometry();
    bufgeo.fromGeometry(geometry);

    // setup material
    var material = new THREE.MeshLambertMaterial({
      color: new THREE.Color(this.data.dressingColor), 
      vertexColors: THREE.VertexColors
    })

    // create mesh
    var mesh = new THREE.Mesh(bufgeo, material);
    dressing.add(mesh);

    this.dressing.setObject3D('mesh', dressing);
  },

  createStars: function() {
    var numStars = 2000;
    var geometry = new THREE.BufferGeometry();
    var positions = new Float32Array( numStars * 3 );
    var radius = this.STAGE_SIZE / 2 - 1;
    var v = new THREE.Vector3();
    for (var i = 0; i < positions.length; i += 3) {
      v.set(this.random(i + 23) - 0.5, this.random(i + 24), this.random(i + 25) - 0.5);
      v.normalize();
      v.multiplyScalar(radius);
      positions[i  ] = v.x;
      positions[i+1] = v.y;
      positions[i+2] = v.z;
    }
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 0);
    var material = new THREE.PointsMaterial({size: 0.3, color: 0xCCCCCC, fog: false});
    this.stars.setObject3D('mesh', new THREE.Points(geometry, material));
  },

  setStars: function (numStars) {
    if (!this.stars){
      this.stars = document.createElement('a-entity');
      this.stars.id= 'stars';
      this.createStars();
      this.el.appendChild(this.stars);
      //this.addObject();
    }
    numStars = Math.floor(Math.min(2000, Math.max(0, numStars)));
    this.stars.getObject3D('mesh').geometry.setDrawRange(0, numStars);
  }

});


/* global AFRAME */
AFRAME.registerShader('skyshader', {
  schema: {
    luminance: { type: 'number', default: 1, min: 0, max: 2, is: 'uniform' },
    turbidity: { type: 'number', default: 2, min: 0, max: 20, is: 'uniform' },
    reileigh: { type: 'number', default: 1, min: 0, max: 4, is: 'uniform' },
    mieCoefficient: { type: 'number', default: 0.005, min: 0, max: 0.1, is: 'uniform' },
    mieDirectionalG: { type: 'number', default: 0.8, min: 0, max: 1, is: 'uniform' },
    sunPosition: { type: 'vec3', default: '0 0 -1', is: 'uniform' },
    color: {type: 'color', default: '#fff'} //placeholder to remove warning
  },

  vertexShader: [
    'varying vec3 vWorldPosition;',

    'void main() {',

      'vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
      'vWorldPosition = worldPosition.xyz;',

      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

    '}'

  ].join('\n'),

  fragmentShader: [
    'uniform sampler2D skySampler;',
    'uniform vec3 sunPosition;',
    'varying vec3 vWorldPosition;',

    'vec3 cameraPos = vec3(0., 0., 0.);',

    'uniform float luminance;',
    'uniform float turbidity;',
    'uniform float reileigh;',
    'uniform float mieCoefficient;',
    'uniform float mieDirectionalG;',

    '// constants for atmospheric scattering',
    'const float e = 2.71828182845904523536028747135266249775724709369995957;',
    'const float pi = 3.141592653589793238462643383279502884197169;',

    'const float n = 1.0003; // refractive index of air',
    'const float N = 2.545E25; // number of molecules per unit volume for air at',
    '// 288.15K and 1013mb (sea level -45 celsius)',
    'const float pn = 0.035;  // depolatization factor for standard air',

    '// wavelength of used primaries, according to preetham',
    'const vec3 lambda = vec3(680E-9, 550E-9, 450E-9);',

    '// mie stuff',
    '// K coefficient for the primaries',
    'const vec3 K = vec3(0.686, 0.678, 0.666);',
    'const float v = 4.0;',

    '// optical length at zenith for molecules',
    'const float rayleighZenithLength = 8.4E3;',
    'const float mieZenithLength = 1.25E3;',
    'const vec3 up = vec3(0.0, 1.0, 0.0);',

    'const float EE = 1000.0;',
    'const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;',
    '// 66 arc seconds -> degrees, and the cosine of that',

    '// earth shadow hack',
    'const float cutoffAngle = pi/1.95;',
    'const float steepness = 1.5;',

    'vec3 totalRayleigh(vec3 lambda)',
    '{',
      'return (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn));',
    '}',

    // see http://blenderartists.org/forum/showthread.php?321110-Shaders-and-Skybox-madness
    '// A simplied version of the total Rayleigh scattering to works on browsers that use ANGLE',
    'vec3 simplifiedRayleigh()',
    '{',
      'return 0.0005 / vec3(94, 40, 18);',
    '}',

    'float rayleighPhase(float cosTheta)',
    '{   ',
      'return (3.0 / (16.0*pi)) * (1.0 + pow(cosTheta, 2.0));',
    '}',

    'vec3 totalMie(vec3 lambda, vec3 K, float T)',
    '{',
      'float c = (0.2 * T ) * 10E-18;',
      'return 0.434 * c * pi * pow((2.0 * pi) / lambda, vec3(v - 2.0)) * K;',
    '}',

    'float hgPhase(float cosTheta, float g)',
    '{',
      'return (1.0 / (4.0*pi)) * ((1.0 - pow(g, 2.0)) / pow(1.0 - 2.0*g*cosTheta + pow(g, 2.0), 1.5));',
    '}',

    'float sunIntensity(float zenithAngleCos)',
    '{',
      'return EE * max(0.0, 1.0 - exp(-((cutoffAngle - acos(zenithAngleCos))/steepness)));',
    '}',

    '// Filmic ToneMapping http://filmicgames.com/archives/75',
    'float A = 0.15;',
    'float B = 0.50;',
    'float C = 0.10;',
    'float D = 0.20;',
    'float E = 0.02;',
    'float F = 0.30;',
    'float W = 1000.0;',

    'vec3 Uncharted2Tonemap(vec3 x)',
    '{',
       'return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;',
    '}',

    'void main() ',
    '{',
      'float sunfade = 1.0-clamp(1.0-exp((sunPosition.y/450000.0)),0.0,1.0);',

      'float reileighCoefficient = reileigh - (1.0* (1.0-sunfade));',

      'vec3 sunDirection = normalize(sunPosition);',

      'float sunE = sunIntensity(dot(sunDirection, up));',

      '// extinction (absorbtion + out scattering) ',
      '// rayleigh coefficients',

      'vec3 betaR = simplifiedRayleigh() * reileighCoefficient;',

      '// mie coefficients',
      'vec3 betaM = totalMie(lambda, K, turbidity) * mieCoefficient;',

      '// optical length',
      '// cutoff angle at 90 to avoid singularity in next formula.',
      'float zenithAngle = acos(max(0.0, dot(up, normalize(vWorldPosition - cameraPos))));',
      'float sR = rayleighZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));',
      'float sM = mieZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));',

      '// combined extinction factor  ',
      'vec3 Fex = exp(-(betaR * sR + betaM * sM));',

      '// in scattering',
      'float cosTheta = dot(normalize(vWorldPosition - cameraPos), sunDirection);',

      'float rPhase = rayleighPhase(cosTheta*0.5+0.5);',
      'vec3 betaRTheta = betaR * rPhase;',

      'float mPhase = hgPhase(cosTheta, mieDirectionalG);',
      'vec3 betaMTheta = betaM * mPhase;',

      'vec3 Lin = pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * (1.0 - Fex),vec3(1.5));',
      'Lin *= mix(vec3(1.0),pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * Fex,vec3(1.0/2.0)),clamp(pow(1.0-dot(up, sunDirection),5.0),0.0,1.0));',

      '//nightsky',
      'vec3 direction = normalize(vWorldPosition - cameraPos);',
      'float theta = acos(direction.y); // elevation --> y-axis, [-pi/2, pi/2]',
      'float phi = atan(direction.z, direction.x); // azimuth --> x-axis [-pi/2, pi/2]',
      'vec2 uv = vec2(phi, theta) / vec2(2.0*pi, pi) + vec2(0.5, 0.0);',
      '// vec3 L0 = texture2D(skySampler, uv).rgb+0.1 * Fex;',
      'vec3 L0 = vec3(0.1) * Fex;',

      '// composition + solar disc',
      'float sundisk = smoothstep(sunAngularDiameterCos,sunAngularDiameterCos+0.00002,cosTheta);',
      'L0 += (sunE * 19000.0 * Fex)*sundisk;',

      'vec3 whiteScale = 1.0/Uncharted2Tonemap(vec3(W));',

      'vec3 texColor = (Lin+L0);   ',
      'texColor *= 0.04 ;',
      'texColor += vec3(0.0,0.001,0.0025)*0.3;',

      'float g_fMaxLuminance = 1.0;',
      'float fLumScaled = 0.1 / luminance;     ',
      'float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (g_fMaxLuminance * g_fMaxLuminance)))) / (1.0 + fLumScaled); ',

      'float ExposureBias = fLumCompressed;',

      'vec3 curr = Uncharted2Tonemap((log2(2.0/pow(luminance,4.0)))*texColor);',
      'vec3 color = curr*whiteScale;',

      'vec3 retColor = pow(color,vec3(1.0/(1.2+(1.2*sunfade))));',

      'gl_FragColor.rgb = retColor;',

      'gl_FragColor.a = 1.0;',
    '}'
  ].join('\n')
});


AFRAME.registerShader('gradientshader', {
  schema: {
    topColor: {type: 'color', default: '1 0 0', is: 'uniform'},
    bottomColor: {type: 'color', default: '0 0 1', is: 'uniform'}
  },
  vertexShader: [
    'varying vec3 vWorldPosition;',
    'void main() {',
    'vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
    'vWorldPosition = worldPosition.xyz;',
    'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );',
    '}'
  ].join('\n'),
  fragmentShader: [
    'uniform vec3 bottomColor;',
    'uniform vec3 topColor;',
    'uniform float offset;',
    'varying vec3 vWorldPosition;',
    'void main() {',
    ' float h = normalize( vWorldPosition ).y;',
    ' gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max(h, 0.0 ), 0.8 ), 0.0 ) ), 1.0 );',
    '}'
  ].join('\n')
});



// https://gist.github.com/banksean/304522
var PerlinNoise = function(r) { 
  if (r == undefined) r = Math;
  this.grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0], 
                                 [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1], 
                                 [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]]; 
  this.p = [];
  for (var i=0; i<256; i++) {
    this.p[i] = Math.floor(r.random(666)*256);
  }
  // To remove the need for index wrapping, double the permutation table length 
  this.perm = []; 
  for(var i=0; i<512; i++) {
    this.perm[i]=this.p[i & 255];
  }
};

PerlinNoise.prototype.dot = function(g, x, y, z) { 
    return g[0]*x + g[1]*y + g[2]*z; 
};

PerlinNoise.prototype.mix = function(a, b, t) { 
    return (1.0-t)*a + t*b; 
};

PerlinNoise.prototype.fade = function(t) { 
    return t*t*t*(t*(t*6.0-15.0)+10.0); 
};

  // Classic Perlin noise, 3D version 
PerlinNoise.prototype.noise = function(x, y, z) { 
  // Find unit grid cell containing point 
  var X = Math.floor(x); 
  var Y = Math.floor(y); 
  var Z = Math.floor(z); 
  
  // Get relative xyz coordinates of point within that cell 
  x = x - X; 
  y = y - Y; 
  z = z - Z; 
  
  // Wrap the integer cells at 255 (smaller integer period can be introduced here) 
  X = X & 255; 
  Y = Y & 255; 
  Z = Z & 255;
  
  // Calculate a set of eight hashed gradient indices 
  var gi000 = this.perm[X+this.perm[Y+this.perm[Z]]] % 12; 
  var gi001 = this.perm[X+this.perm[Y+this.perm[Z+1]]] % 12; 
  var gi010 = this.perm[X+this.perm[Y+1+this.perm[Z]]] % 12; 
  var gi011 = this.perm[X+this.perm[Y+1+this.perm[Z+1]]] % 12; 
  var gi100 = this.perm[X+1+this.perm[Y+this.perm[Z]]] % 12; 
  var gi101 = this.perm[X+1+this.perm[Y+this.perm[Z+1]]] % 12; 
  var gi110 = this.perm[X+1+this.perm[Y+1+this.perm[Z]]] % 12; 
  var gi111 = this.perm[X+1+this.perm[Y+1+this.perm[Z+1]]] % 12; 
  
  // The gradients of each corner are now: 
  // g000 = grad3[gi000]; 
  // g001 = grad3[gi001]; 
  // g010 = grad3[gi010]; 
  // g011 = grad3[gi011]; 
  // g100 = grad3[gi100]; 
  // g101 = grad3[gi101]; 
  // g110 = grad3[gi110]; 
  // g111 = grad3[gi111]; 
  // Calculate noise contributions from each of the eight corners 
  var n000= this.dot(this.grad3[gi000], x, y, z); 
  var n100= this.dot(this.grad3[gi100], x-1, y, z); 
  var n010= this.dot(this.grad3[gi010], x, y-1, z); 
  var n110= this.dot(this.grad3[gi110], x-1, y-1, z); 
  var n001= this.dot(this.grad3[gi001], x, y, z-1); 
  var n101= this.dot(this.grad3[gi101], x-1, y, z-1); 
  var n011= this.dot(this.grad3[gi011], x, y-1, z-1); 
  var n111= this.dot(this.grad3[gi111], x-1, y-1, z-1); 
  // Compute the fade curve value for each of x, y, z 
  var u = this.fade(x); 
  var v = this.fade(y); 
  var w = this.fade(z); 
   // Interpolate along x the contributions from each of the corners 
  var nx00 = this.mix(n000, n100, u); 
  var nx01 = this.mix(n001, n101, u); 
  var nx10 = this.mix(n010, n110, u); 
  var nx11 = this.mix(n011, n111, u); 
  // Interpolate the four results along y 
  var nxy0 = this.mix(nx00, nx10, v); 
  var nxy1 = this.mix(nx01, nx11, v); 
  // Interpolate the two last results along z 
  var nxyz = this.mix(nxy0, nxy1, w); 

  return nxyz; 
};



// TODO : REMOVE
/*
  add this code
  run console.log( canvas );
  see the canvas

  if the canvas is running a webgl context, it'll need the preserveDrawingBuffer flag set to true
*/

( function() {

  var _oldConsole = console.log;

  // Code from https://github.com/adriancooney/console.image
  
  function getBox(width, height) {
    return {
      string: "+",
      style: "font-size: 1px; padding: " + Math.floor(height/2) + "px " + Math.floor(width/2) + "px; line-height: " + height + "px;"
    }
  }

  function logImage(url, scale) {
    scale = scale || 1;
    var img = new Image();

    img.onload = function() {
      var dim = getBox(this.width * scale, this.height * scale);
      console.log("%c" + dim.string, dim.style + "background: url(" + url + "); background-size: " + (this.width * scale) + "px " + (this.height * scale) + "px; color: transparent;");
    };

    img.src = url;

    
  };

  console.log = function() {

    var special = false;

    [].forEach.call( arguments, function( a ) { 
      if( a instanceof HTMLCanvasElement ) special = true;;
    } );

    if( special ) {

      [].forEach.call( arguments, function( a ) { 
      
        _oldConsole.apply( console, [ a ] );

        if( a instanceof HTMLCanvasElement ) {

          logImage( a.toDataURL() );

        }

      } );

    } else {

      _oldConsole.apply( console, arguments );

    }

  }

} )();