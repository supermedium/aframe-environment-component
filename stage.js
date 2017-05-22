/* global AFRAME, THREE */
AFRAME.registerComponent('stage', {
  schema: {
    skyType: {default: 'realistic', oneOf:['color', 'gradient', 'realistic']},
    skyColor: {type: 'color', default: '#88c'},
    horizonColor: {type: 'color', default: '#ddd'},
    autoLights: {default: true},
    sunPosition: {type:'vec3', default: '0 1 -1'},
    fog: {default: true},

    groundShape: {default: 'desert', oneOf:['none', 'flat', 'desert', 'hills', 'mountains']}, 
    groundStyle: {default: 'smooth', oneOf:['flat', 'smooth', '80s', 'textured', 'snowy']}, // TODO
    groundColor: {type: 'color', default: '#795449'},

    gridType: {default:'none', oneOf:['none', 'cross', 'squares', 'circles', 'checkerboard', 'spots']},
    gridColor: {type: 'color', default: '#ccc'},
    gridSpacing: {type: 'float', default: 1.0},
    gridSize: {type: 'float', default: 10.0} 
  },

  init: function () {

    this.STAGE_RADIUS = 200;

    // create sky

    this.sky = document.createElement('a-sky');
    this.sky.setAttribute('radius', this.STAGE_RADIUS / 2);
    this.sky.setAttribute('theta-length', 110);

    // create ground

    this.groundMaterial = null;
    this.ground = document.createElement('a-entity');
    this.ground.setAttribute('rotation', '-90 0 0');
    this.updateGround(true);

    // create grid

    this.gridMaterial = new THREE.LineBasicMaterial({color: this.data.gridColor});
    this.updateGrid();

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

    // add all to the scene

    this.el.appendChild(this.hemilight);
    this.el.appendChild(this.sunlight);
    this.el.appendChild(this.sky);
    this.el.appendChild(this.ground);


    var self = this;
    window.addEventListener('keypress', function(evt){
      if(evt.keyCode==33){
        self.el.setAttribute('stage', {sunPosition: {x: self.data.sunPosition.x, y: self.data.sunPosition.y - 0.03, z: self.data.sunPosition.z}})
      }
      else if(evt.keyCode==34){
        self.el.setAttribute('stage', {sunPosition: {x: self.data.sunPosition.x, y: self.data.sunPosition.y + 0.03, z: self.data.sunPosition.z}})
      }
    })
  },

  // returns a fog color from a specified sky type and sun height
  getFogColor: function (skyType, sunHeight) {

    var simpleColor = false;
    if (skyType=='color'){
      simpleColor = this.data.skyColor;
    }
    else if (skyType=='gradient'){
      simpleColor = this.data.horizonColor;
    }
    if (simpleColor !== false) {
      simpleColor = new THREE.Color(simpleColor);
      simpleColor.multiplyScalar(0.9);
      return simpleColor.getHex();
    }

    var FOG_RATIOS = [1, 0.5, 0.22, 0.1, 0.05, 0.02, 0];
    var FOG_COLORS = ['#DBE5E7', '#DAE3E4', '#A7B5B6', '#8D9088', '#6D6A5B', '#4B4231', '#000000'];

    if (sunHeight <= 0) return '#000';

    sunHeight = Math.min(1, sunHeight);

    for (var i = 0; i < FOG_RATIOS.length; i++){
      if (sunHeight > FOG_RATIOS[i]){
      var c1 = new THREE.Color(FOG_COLORS[i - 1]);
      var c2 = new THREE.Color(FOG_COLORS[i]);
      var a = (sunHeight - FOG_RATIOS[i]) / (FOG_RATIOS[i - 1] - FOG_RATIOS[i]);
      c2.lerp(c1, a);
      return c2.getHex();
      }
    }
    return '#000';
  },

  update: function (oldData) {
    var skyType = this.data.skyType;
    var sunPos = new THREE.Vector3(this.data.sunPosition.x, this.data.sunPosition.y, this.data.sunPosition.z);
    sunPos.normalize();
    if (skyType == 'realistic') {
      this.sky.setAttribute('material', {'sunPosition': sunPos});
    }
    if (this.sunlight) {
      this.sunlight.setAttribute('position', this.data.sunPosition);
      if (skyType == 'realistic') {
        this.sunlight.setAttribute('light', {'intensity': 0.1 + sunPos.y * 0.5});
        this.hemilight.setAttribute('light', {'intensity': 0.1 + sunPos.y * 0.5});
      }
      else {
        // dim down the sky color for the light
        var skycol = new THREE.Color(this.data.skyColor);
        skycol.r = (skycol.r + 1.0) / 2.0;
        skycol.g = (skycol.g + 1.0) / 2.0;
        skycol.b = (skycol.b + 1.0) / 2.0;
        this.hemilight.setAttribute('light', {'color': skycol.getHex()});
      }
    } 

    if (
      !oldData || 
      skyType != oldData.skyType ||
      this.data.skyColor != oldData.skyColor ||
      this.data.horizonColor != oldData.horizonColor) {

      var mat = {};

      if (skyType != oldData.skyType) {
        mat.shader = {'color': 'flat', 'gradient': 'gradientshader', 'realistic': 'skyshader'}[skyType];
      }
      if (skyType == 'color') {
        mat.color = this.data.skyColor;
        mat.fog = false;
      }
      else if (skyType == 'gradient') {
        mat.topColor = this.data.skyColor;
        mat.bottomColor = this.data.horizonColor;
      }
      else if (skyType == 'realistic') {
      }

      this.sky.setAttribute('material', mat);
    }

    if (this.data.fog) {
      this.el.sceneEl.setAttribute('fog', {color: this.getFogColor(skyType, sunPos.y), far: 100});
    }
    else {
      this.el.sceneEl.removeAttribute('fog');
    }

    if (this.data.autoLights !== oldData.autoLights) {
      this.sunlight.setAttribute('visible', this.data.autoLights);
      this.hemilight.setAttribute('visible', this.data.autoLights);
    }

    if (!oldData || this.data.gridColor != oldData.gridColor) {
      this.gridMaterial.color = new THREE.Color(this.data.gridColor);
    }
    if (!oldData || (this.data.gridType != oldData.gridType ||
      this.data.gridSpacing != oldData.gridSpacing ||
      this.data.gridSize != oldData.gridSize)) {
      this.updateGrid();
    }
    if (!oldData || 
        this.data.groundColor != oldData.groundColor ||
        this.data.groundShape != oldData.groundShape ||
        this.data.groundStyle != oldData.groundStyle
        ) {
      this.updateGround(this.data.groundShape != oldData.groundShape);
      if (this.hemilight) this.hemilight.setAttribute('light', {'groundColor': this.data.groundColor});
    }
  },

  updateGround: function (updateGeometry) {
    if (updateGeometry) {
      var visibleground = this.data.groundShape != 'none';
      this.ground.setAttribute('visible', visibleground);
      if (!visibleground) return;

      var resolution = 64; //this.data.groundShape == 'flat' ? 1 : 64;
      if (!this.groundGeometry) this.groundGeometry = new THREE.PlaneGeometry(this.STAGE_RADIUS + 2, this.STAGE_RADIUS + 2, resolution - 1, resolution - 1);
      this.groundGeometry.dynamic = true;
      var perlin = new PerlinNoise();
      var verts = this.groundGeometry.vertices;
      var numVerts = this.groundGeometry.vertices.length;
      var frequency = 10;
      var inc = frequency / resolution;
      var amplitude = {'flat': 0, 'desert': 3, 'hills': 10, 'mountains': 20}[this.data.groundShape];

      for (var i = 0, x = 0, y = 0; i < numVerts; i++) {
        if (amplitude == 0) {
          verts[i].z = 0; 
          continue;
        }
        var h = perlin.noise(x, y, 0) * amplitude;
        x += inc;
        if (x >= 10) {
          x = 0;
          y += inc;
        }
        // TODO: improve smoothing in center
        if (Math.abs(x / frequency - 0.5) < 0.1 && Math.abs(y / frequency - 0.5) < 0.1) h = 0;
        verts[i].z = h;
      }

      this.groundGeometry.computeFaceNormals();
      this.groundGeometry.computeVertexNormals();
      this.groundGeometry.verticesNeedUpdate  = true;
      this.groundGeometry.normalsNeedUpdate  = true;
    }

    var texResolution = 512;
    if (!this.groundMaterial) {
      this.groundCanvas = document.createElement('canvas');
      this.groundCanvas.width = texResolution;
      this.groundCanvas.height = texResolution;
      this.groundTexture = new THREE.Texture(this.groundCanvas);
      this.groundTexture.wrapS = THREE.RepeatWrapping;
      this.groundTexture.wrapT = THREE.RepeatWrapping;
      this.groundMaterial = new THREE.MeshPhongMaterial({map: this.groundTexture, wireframe: false});
      //this.ground.object3D.children[0].material = this.groundMaterial;
    }
    var res2 = Math.floor(texResolution / 2);
    var ctx = this.groundCanvas.getContext('2d');
    /*var grd = ctx.createRadialGradient(res2, res2, 0, res2, res2, res2);
    grd.addColorStop(0, this.data.groundColor);
    grd.addColorStop(0.4, '#C0D1D5');
    ctx.fillStyle = grd;
    */
    ctx.fillStyle = this.data.groundColor;
    ctx.fillRect(0, 0, texResolution, texResolution);

    this.groundTexture.repeat.set(40, 40);

    this.groundTexture.needsUpdate = true;

    if (updateGeometry) {
      var mesh = new THREE.Mesh(this.groundGeometry, this.groundMaterial)
      this.ground.setObject3D('mesh', mesh);
    }
  },

  updateGrid: function () {
    var gridGeometry = new THREE.BufferGeometry();
    var gridSize = this.data.gridSize;
    var gridSpacing = this.data.gridSpacing;
    var ypos = 0.001;
    var grid = null;

    if (this.data.gridType == 'cross') {
      var s = gridSize / 2;
      var vertices = new Float32Array([-s, 0, ypos, s, 0, ypos, 0, -s, ypos, 0, s, ypos]);
      gridGeometry.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ) );
      grid = new THREE.LineSegments(gridGeometry, this.gridMaterial);
    }
    else if (this.data.gridType == 'squares') {
      gridSize = Math.floor(gridSize);
      var startLines = - (gridSize-1) * gridSpacing / 2;
      var endLines = (gridSize-1) * gridSpacing / 2;
      var vertices = new Float32Array(gridSize * 4 * 3);
      var p;
      for (var i = 0; i < gridSize; i++) {
        p = startLines + i * gridSpacing;
        vertices[(i * 4 + 0) * 3 + 0] = startLines;
        vertices[(i * 4 + 0) * 3 + 1] = p;
        vertices[(i * 4 + 0) * 3 + 2] = ypos;
        vertices[(i * 4 + 1) * 3 + 0] = endLines;
        vertices[(i * 4 + 1) * 3 + 1] = p;
        vertices[(i * 4 + 1) * 3 + 2] = ypos;

        vertices[(i * 4 + 2) * 3 + 0] = p;
        vertices[(i * 4 + 2) * 3 + 1] = startLines;
        vertices[(i * 4 + 2) * 3 + 2] = ypos;
        vertices[(i * 4 + 3) * 3 + 0] = p;
        vertices[(i * 4 + 3) * 3 + 1] = endLines;
        vertices[(i * 4 + 3) * 3 + 2] = ypos;
      }
      gridGeometry.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ) );
      grid = new THREE.LineSegments(gridGeometry, this.gridMaterial);
    }
    else if (this.data.gridType == 'circles') {
      var divisions = 16;
      var vertices = new Float32Array(gridSize * divisions * 2 * 3);
      for (var i = 0; i < gridSize; i++) {
        for (var r = 0; r < divisions; r++) {
          ////?????
        }
      }

      gridGeometry.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ) );
      grid = new THREE.LineSegments(gridGeometry, this.gridMaterial);
    }

    if (grid !== null ) {
      this.ground.setObject3D('grid', grid);
    }
    else if (this.ground.getObject3D('grid')) {
        this.ground.removeObject3D('grid');
      }
  }
});


/* global AFRAME */
AFRAME.registerShader('skyshader', {
  schema: {
    luminance: { type: 'number', default: 1, max: 0, min: 2, is: 'uniform' },
    turbidity: { type: 'number', default: 2, max: 0, min: 20, is: 'uniform' },
    reileigh: { type: 'number', default: 1, max: 0, min: 4, is: 'uniform' },
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
    this.p[i] = Math.floor(r.random()*256);
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