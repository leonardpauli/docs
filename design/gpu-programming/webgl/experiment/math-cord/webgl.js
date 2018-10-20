// webgl test
// created by Leonard Pauli, 26 jul 2018
// based on https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
// 

const inputs = [].slice.call(document.querySelectorAll('.controls > input'))

function main() {
  const canvas = document.querySelector("#glCanvas")
  const gl = canvas.getContext("webgl")
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  const uCanvasSize = [600, 600]

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);


  // shader.vertex: vertex -> shape (using matrix operations)
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    attribute vec4 aVertexData;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;
    varying lowp vec4 vData;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
      vData = aVertexData;
    }
  `;

  // shader.fragment: shape.pixel.position -> shape.pixel.data{color, etc...}
  const fsSource = `
    precision lowp float;
    // varying lowp vec4 vColor;
    varying lowp vec4 vData;

    vec2 uCanvasSize = vec2(${uCanvasSize[0]}.0, ${uCanvasSize[1]}.0);
    vec2 xy;
    float x;
    float y;

    float uspr;
    vec4 part0;
    vec4 part1;
    vec4 part2;

    float tdist0;
    float tdist1;
    float tdist2;
    float tdist;
    float tdistslen = 3.0;

    float ratio;
    float ratiol;
    float ratiol0;
    float ratiol1;
    float ratiol2;

    float vala;
    float valb;
    vec4 vColor;

    float inbet;

    float ratolGet(float ratiol, float i) { return max(0.0,min(abs( ratiol-i ),1.0)); }
    float dist(vec2 a, vec2 b) { return sqrt(pow(a[0]-b[0], 2.0)+pow(a[1]-b[1], 2.0)); }

    float tdistNGet(vec4 partA, vec4 partB, float ratiolN) {
      return sqrt(
        pow(partA[0]-(   partA[2] + (partB[2]-partA[2]) * ratiolN   ), 2.0) +
        pow(partA[1]-(   partA[3] + (partB[3]-partA[3]) * ratiolN   ), 2.0)
      );
    }

    void main(void) {
      xy = vec2(gl_FragCoord.x / uCanvasSize.x, gl_FragCoord.y / uCanvasSize.y);
      x = xy[0]-vData[0];
      y = xy[1]-vData[1];

      ratio = vData[2];
      ratiol = ratio*(tdistslen-1.0);

      uspr = 0.2;
      // part0 = vec4(x, y, 0.2, uspr);
      // part1 = vec4(x, y, -0.1, uspr);
      part0 = vec4(dist(vec2(x, y), vec2(0.0, 0.0)), 0, 0.2, 0);
      part1 = vec4(x, 0, 0, 0);
      part2 = vec4(x, 0, 0.3, 0);
      part1 = vec4(0, pow(x*2.0, 2.0), 0, y);
      
      ratiol0 = ratolGet(ratiol, 0.0);
      ratiol1 = ratolGet(ratiol, 1.0);
      ratiol2 = ratolGet(ratiol, 2.0);

      tdist0 = tdistNGet(part0, part1, ratiol0);
      tdist1 = tdistNGet(part1, part0, ratiol1);
      tdist2 = tdistNGet(part2, part1, ratiol2);

      tdist = (
        tdist0 * (1.0-ratiol0) +
        tdist1 * (1.0-ratiol1) +
        tdist2 * (1.0-ratiol2)
      ) / tdistslen;

      inbet = abs(ratio-floor(ratio+0.5))*3.0;

      vala = (1.0 - max(0.0, min(pow(tdist*5.0*(1.0+inbet), 0.3+inbet/2.0), 1.0)));
      valb = (1.0 - max(0.0, min(pow(tdist*30.0, 0.5), 1.0)))*0.3;
      vColor = vec4(
        vala,
        valb,
        valb + min(1.0,
          (1.0 - max(0.0, min( pow( abs(y)*100.0, 0.3), 1.0))) +
          (1.0 - max(0.0, min( pow( abs(x)*100.0, 0.3), 1.0)))
        ),
        1.0);
      gl_FragColor = vColor; // vec4(x, y, vData[2], 1.0);
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource)

  const programInfo = {
    program: shaderProgram,
    attribLocations: { // many values -> buffer -> attribute ->> shader iteration
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      vertexData: gl.getAttribLocation(shaderProgram, 'aVertexData'),
    },
    uniformLocations: { // one value -> uniform -> (each shader iteration)
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  const buffers = initBuffers(gl)

  const render = t=> { // t is ms since start (?)
    updateData(gl, buffers.data, t)
    drawScene(gl, programInfo, buffers, t*1);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

const getData = (t = 0)=> {
  return Array(4).fill().map((_, i)=> inputs.map(e=> e.value)).reduce((a, v)=> a.concat(v), [])
}
const updateData = (gl, buffer, t)=> {
  const data = getData(t)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(data));
}


const drawScene = (gl, programInfo, buffers, t)=> {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  // mod projectionMatrix
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  // set drawing position
  const modelViewMatrix = mat4.create(); // identity matrix; center of screen
  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -0.1]);  // amount to translate, eg. -t/1000

  loadAttribArray(gl, {location: programInfo.attribLocations.vertexPosition, buffer: buffers.position}, {numComponents: 2})
  loadAttribArray(gl, {location: programInfo.attribLocations.vertexColor, buffer: buffers.color}, {numComponents: 4})
  loadAttribArray(gl, {location: programInfo.attribLocations.vertexData, buffer: buffers.data}, {numComponents: 4})

  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

const loadAttribArray = (gl, {location, buffer}, {
  numComponents = 1, // nr of values to pull out each iteration
  type = gl.FLOAT, // gl.FLOAT -> 32bits floats
  normalize = false,
  stride = 0, // 0 -> use type.bytes * numComponents
  offset = 0, // "initial stride" (in bytes)
} = {})=> {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(location, numComponents, type, normalize, stride, offset);
  gl.enableVertexAttribArray(location);
}

const initBuffers = gl=> {
  const positions = [
    -1.0,  1.0,
     1.0,  1.0,
    -1.0, -1.0,
     1.0, -1.0,
  ];

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  const colors = [
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0,    // blue
  ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const data = getData()

  const dataBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    data: dataBuffer,
  };
}

const initShaderProgram = (gl, vsSource, fsSource)=> {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // shader.program.create
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // on fail
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

// shader.create with (type, source) (inc. source.(upload (to "shader object"), compile))
const loadShader = (gl, type, source)=> {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // on compile.fail
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}



// start
main()
