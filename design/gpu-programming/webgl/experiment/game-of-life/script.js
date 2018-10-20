const imageSelected = name=> {
	const image = new Image()
	image.src = '/image/'+name
	image.onload = ()=> render(image)
}

const imageddvalues = 'conways_game_of_life_breeder.png,stripes.jpg,tree.jpg,l.png'.split(',')

let delayLoop = localStorage.speed || 70

const main = ()=> {
	const imdd = document.body.querySelector('.image-dd')
	imdd.innerHTML = imageddvalues.map(v=> '<option value="'+v+'">'+v+'</option>').reduce((a, b)=> a+b, '')
	imdd.addEventListener('change', ()=> {
		window.location.href = '/?image='+imdd.value
	})
	const val = new URLSearchParams(window.location.search).get('image')
		|| imdd.value || imageddvalues[0]
	imdd.value = val
	imageSelected(val)

	const speedUpdate = ()=> localStorage.speed = delayLoop = Math.sqrt(parseFloat(speedel.value)) * (ultra.checked?10:1)
	const speedel = document.body.querySelector('.speed')
	speedel.addEventListener('change', ()=> {
		speedUpdate()
	})
	const ultra = document.body.querySelector('.ultrarapid')
	ultra.addEventListener('change', ()=> {
		speedUpdate()
	})

	const upload = document.body.querySelector('.upload')
	upload.addEventListener('change', event=> {
		if (!event.target.files.length) return
		const selectedFile = event.target.files[0]
		const reader = new FileReader()
		reader.onload = e=> {
			const image = new Image()
			image.onload = ()=> { cancelAnim(); render(image) }
			image.src = e.target.result
		}
		reader.readAsDataURL(selectedFile)
	})
}

const modifyTexture = ({
	gl, texture, image, fn = ({textureSize, pixels})=> {
		let f = Math.random()
		for (let i=0; i < textureSize; i+=4) {
			if (Math.random()< 0.1) f = Math.random()
			pixels[i] = (1-(f< 0.2?0.6:1)* Math.random())*255
		}
	},
})=> {
	// https://stackoverflow.com/questions/35171041/webgl-texture-pixel-value-modify
	if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) return
	const textureSize = image.width * image.height * 4 // r, g, b, a
	const pixels = new Uint8Array(textureSize)
	gl.readPixels(0, 0, image.width, image.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

	fn({textureSize, pixels})

	// setTimeout(()=> {
	// upload changes
	gl.bindTexture(gl.TEXTURE_2D, texture)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
		image.width, image.height, 0,
		gl.RGBA, gl.UNSIGNED_BYTE, pixels)
	// }, 0)

}
const animInfo = {}
const cancelAnim = ()=> {
	clearTimeout(animInfo.timeoutId)
	cancelAnimationFrame(animInfo.requestAnimationFrameId)
	animInfo.canvas.remove()
}
const render = image=> {
	// Get A WebGL context
	/** @type {HTMLCanvasElement} */
	const canvas = document.createElement('canvas')
	document.body.append(canvas)
	animInfo.canvas = canvas
	const gl = canvas.getContext('webgl')
	if (!gl) return


	const vertexAttribPointerSet = vertexAttribPointerSetGet(gl)
	const clear = ()=> {
		gl.clearColor(0, 0, 0, 0.5)
		gl.clear(gl.COLOR_BUFFER_BIT)
	}


	webglUtils.resizeCanvasToDisplaySize(gl.canvas)
	const viewportToCanvasSet = ()=>
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height) // clip space -> pixels


	const program = webglUtils.createProgramFromScripts(gl, [
		'2d-vertex-shader', '2d-fragment-shader',
	]) // setup GLSL program


	// look up where the vertex data needs to go.
	const positionLocation = gl.getAttribLocation(program, 'a_position')
	const texcoordLocation = gl.getAttribLocation(program, 'a_texCoord')


	// Create a buffer to put three 2d clip space points in
	const positionBuffer = gl.createBuffer()
	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)


	const drawingTargetGeometryViewportSet = ()=> {
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
		// const scale = Math.max(gl.canvas.width/image.width, gl.canvas.height/image.height)
		// setRectangle(gl, 0, 0, image.width*scale, image.height*scale)
		setRectangle(gl, 0, 0, gl.canvas.width, gl.canvas.height)
	}

	drawingTargetGeometryViewportSet()

	// provide texture coordinates for the rectangle.
	const texcoordBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, vertixRectNormalisedFlippedGet(), gl.STATIC_DRAW)

	// Create a texture.
	const texture = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texture)

	// Set the parameters so we can render any size image.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

	// Upload the image into the texture.
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)


	// lookup uniforms
	const resolutionILocation = gl.getUniformLocation(program, 'u_resolution_i')
	const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
	const timeLocation = gl.getUniformLocation(program, 'u_time')
	

	gl.useProgram(program) // program / pair of shaders


	const initInput = ()=> {
		gl.enableVertexAttribArray(positionLocation)
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer) // select buffer to bind
		vertexAttribPointerSet(positionLocation) // bind it
		
		gl.enableVertexAttribArray(texcoordLocation)
		gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
		vertexAttribPointerSet(texcoordLocation)

		gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height)
		gl.uniform2f(resolutionILocation, image.width, image.height)

		const startTime = new Date()
		const refreshInput = ()=> {
			gl.uniform1f(timeLocation, new Date()-startTime)
		}
		refreshInput()
		return refreshInput
	}
	const refreshInput = initInput()

	gl.bindTexture(gl.TEXTURE_2D, texture)

	const drawRect = ()=> {
		const primitiveType = gl.TRIANGLES
		const offset = 0
		const count = 6
		gl.drawArrays(primitiveType, offset, count)
	}


	const renderToTargetBufferGet = ()=> {
		const targetTextureWidth = image.width
		const targetTextureHeight = image.height

		const targetTextureGet = ()=> {
			const texture = gl.createTexture()
			gl.bindTexture(gl.TEXTURE_2D, texture)
			
			// define size and format of level 0
			const level = 0
			const internalFormat = gl.RGBA
			const border = 0
			const format = gl.RGBA
			const type = gl.UNSIGNED_BYTE
			const data = null
			gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
				targetTextureWidth, targetTextureHeight, border,
				format, type, data)

			// set the filtering so we don't need mips
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

			return texture
		}

		const targetTextureA = targetTextureGet()
		const targetTextureB = targetTextureGet()

		const fb = gl.createFramebuffer()

		const framebufferSetTargetTexture = texture=> {
		// gl.bindFramebuffer(gl.FRAMEBUFFER, fb)

		// attach the texture as the "first color attachment" (?)
			const attachmentPoint = gl.COLOR_ATTACHMENT0
			const level = 0
			gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, texture, level)
		}

		const textureOriginGet = n=> n==0? texture: n%2==0?targetTextureA:targetTextureB
		const textureTargetGet = n=> n%2!=0?targetTextureA:targetTextureB

		const renderToTargetBuffer = n=> {
			gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
			framebufferSetTargetTexture(textureTargetGet(n))
			gl.bindTexture(gl.TEXTURE_2D, textureOriginGet(n))

			gl.viewport(0, 0, targetTextureWidth, targetTextureHeight)
			clear()

			drawRect()
		}
		return {
			renderToTargetBuffer,
			textureOriginGet,
			textureTargetGet,
		}
	}

	const {
		renderToTargetBuffer,
		textureOriginGet,
		textureTargetGet,
	} = renderToTargetBufferGet()
	
	const renderToCanvas = n=> {
	  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
	  viewportToCanvasSet()
	  clear()

	  // gl.bindTexture(gl.TEXTURE_2D, texture)
	  gl.bindTexture(gl.TEXTURE_2D, textureOriginGet(n))
	  drawRect()
	}


	
	let n = 0
	const loop = ()=> {
		refreshInput()
		renderToTargetBuffer(n)
		renderToCanvas(n)
		n++
		animInfo.timeoutId = setTimeout(()=> delayLoop==0? loop(): (animInfo.requestAnimationFrameId = requestAnimationFrame(loop)), delayLoop+1)
	}
	loop()

	canvas.addEventListener('mousedown', e=> {
		const p = {
			x: e.offsetX/e.target.offsetWidth,
			y: 1-e.offsetY/e.target.offsetHeight,
		}
		const imgp = {x: Math.floor(p.x*image.width), y: Math.floor(p.y*image.height)}
		const pixelPosToIdx = ({x, y})=> Math.floor(y*image.width*4 + x*4)
		renderToTargetBuffer(n)
		modifyTexture({gl, texture: textureOriginGet(n), image, fn: ({textureSize, pixels})=> {
			// for (let i = 0; i< textureSize/4; i++) {
			const xf = Math.random()>0.5 || e.shiftKey? 1: -1
			const yf = Math.random()>0.5 || e.shiftKey? 1: -1
			const y = e.altKey? 1: 0

			pixels[y+pixelPosToIdx(imgp)] = 255
			pixels[y+pixelPosToIdx(imgp)+pixelPosToIdx({x: 0, y: yf*1})] = 255
			pixels[y+pixelPosToIdx(imgp)+pixelPosToIdx({x: xf*-1, y: 0})] = 255
			pixels[y+pixelPosToIdx(imgp)+pixelPosToIdx({x: xf*-1, y: yf*-1})] = 255
			pixels[y+pixelPosToIdx(imgp)+pixelPosToIdx({x: xf*1, y: yf*-1})] = 255
			// }
		}})
	})
}

const setRectangle = (gl, x, y, w, h, flip = false)=> {
	const x0 = x
	const x1 = x + w
	const y0 = y
	const y1 = y + h
	const rect = new Float32Array(!flip? [
		x0, y0, x1, y0, x0, y1,
		x0, y1, x1, y0, x1, y1,
	]: [
		x0, y1, x1, y1, x0, y0,
		x0, y0, x1, y1, x0, y1,
	])
	gl.bufferData(gl.ARRAY_BUFFER, rect, gl.STATIC_DRAW)
}


// utils

const vertexAttribPointerSetGet = gl=> (attributeLocation, {
	size = 2, // 2 components per iteration
	type = gl.FLOAT, // the data is 32bit floats
	normalize = false,
	stride = 0, // 0 = move forward size * sizeof(type) each iteration to get the next position
	offset = 0, // in buffer
} = {})=> gl.vertexAttribPointer(attributeLocation, size, type, normalize, stride, offset)

// const vertixRectNormalisedGet = ()=> new Float32Array([
// 	0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
// 	0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
// ])

const vertixRectNormalisedFlippedGet = ()=> new Float32Array([
	// 0.0, 1.0, 1.0, 1.0, 0.0, 0.0,
	// 0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
	0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
	0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
	// 0.0, 1.0, 0.0, 0.0, 1.0, 1.0,
	// 1.0, 1.0, 0.0, 0.0, 0.0, 1.0,
	// 0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
	// 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
])

// start

main()
