let frameNr = 400
let frameNr2 = 0

let inputA
let inputB
let inputC

let playing = true

function setup() {
	createCanvas(ourOrigo.x*2,ourOrigo.y*2)
	frameRate(20)
	


	inputA = document.getElementById('a')
	inputB = document.getElementById('b')
	inputC = document.getElementById('c')
	
	let buttonStartToggle = document.getElementById('start-toggle')
	buttonStartToggle.addEventListener('click', e=> {
		playing ? noLoop(): loop()
		playing = !playing
	})
}

function draw() {
	background("rgba(255,255,255,0.05)")

	stroke("black")
	const xS = ourOrigoToSysOrigo({
		x: ourOrigo.x*-1,
		y: ourOrigo.y*0,
	})
	const xE = ourOrigoToSysOrigo({
		x: ourOrigo.x*1,
		y: ourOrigo.y*0,
	})
	line(xS.x, xS.y, xE.x, xE.y)

	const yS = ourOrigoToSysOrigo({
		x: ourOrigo.x*0,
		y: ourOrigo.y*-1,
	})
	const yE = ourOrigoToSysOrigo({
		x: ourOrigo.x*0,
		y: ourOrigo.y*1,
	})
	line(yS.x, yS.y, yE.x, yE.y)
	noStroke()

	frameNr++
	frameNr2++
  // put drawing code here
  
  // drawPoint(ourOrigo)
  // drawPoint(ourOrigoToSysOrigo({x: 0, y: 0}))
  // drawOurPoint({x: ourOrigo.x*0, y: ourOrigo.y*0})
  // drawOurPoint({x: ourOrigo.x*1, y: ourOrigo.y*1})
  // drawOurPoint({x: ourOrigo.x*-1, y: ourOrigo.y*-1})
  // drawOurPoint({x: ourOrigo.x*-1, y: ourOrigo.y*1})
  // drawOurPoint({x: ourOrigo.x*1, y: ourOrigo.y*-1})
  // drawOurPoint({x: ourOrigo.x, y: ourOrigo.y})


  // const cf = x=> Math.sqrt(Math.pow(1, 2)- Math.pow(x, 2))
  // const f = x=> cf(x/ourOrigo.x)

  // for (let i = ourOrigo.x*-1; i < ourOrigo.x*1; i+=1) {
  // 	const x = i
  // 	const ourPoint = { x: x, y: f(x) }
  // 	drawOurPoint(ourPoint)
  // 	console.log(ourPoint.x, ourPoint.y)
  // }

  const ratio = inputA.value//Math.min(1, 0.5+frameNr2/120/3)
  //console.log(ratio)
  
  const dre = (cnt, rv)=> {
  for (let i = 0; i< cnt; i++) {
  	const p = rndp()

  	const dists = fs.map(f=> f(p)).map(([a, t])=> a.dist(t).a)

  	const distsWSum = dists.map((d, i)=> {
  		const stepdist = abs(ratio*(dists.length-1)-i)
  		const stepdist1 = 1 - max(0, min(stepdist, 1))
  		return stepdist1*d
  	}).reduce((s, v)=> s+v, 0)
  	const rdis = distsWSum / dists.length
  	// console.log(distsWSum, rdis)

		const worg = 100
		const w = Math.max(2, inputC.value*worg) // worg-frameNr/7)
		
		if (rdis < worg*3) {
			const op = 1-Math.min(1, (Math.max(0.5, rdis/w)-0.5)/0.5)
			fill(`hsla(0,100%,${toc(rdis/w)}%,${op})`)
			const r = 1 + 30 * rv // 30-(Math.floor(frameNr/3)+1)
			drawOurPoint(p, Math.max(3, r))
		}
  }
  }

  const basc = 150
  dre(basc*pow(2, 1), inputC.value*1)
  dre(basc*pow(2, 1), inputC.value*0.8)
  dre(basc*pow(2, 2), inputC.value*0.6)
  // dre(basc*pow(2, 4), inputC.value/4)

  // frameRate(0)
}

const fns = {
	c: ({x: a, y: b})=> [
		new Complex(a, b).abs(),
		new Complex(ourOrigo.x*0.5, 0),
	],
	p1: ({x: a, y: b})=> [
		new Complex(a, b),
		new Complex(200, 200),
	],
	p2: ({x: a, y: b})=> [
		new Complex(a, b),
		new Complex(-200, b),
	]
}
// const fs = [fns.p1, fns.c, fns.p2]
const uspr = 100
const fs = [
	({x: a, y: b})=> [
		new Complex(a, b),
		new Complex(uspr, b),
	],
	({x: a, y: b})=> [
		new Complex(a, b).abs(),
		new Complex(uspr, 0),
	],
	({x: a, y: b})=> [
		new Complex(a, b).sub(50).abs(),
		new Complex(uspr, 0),
	],
	({x: a, y: b})=> [
		new Complex(a, b).mul(2).sub(50).abs(),
		new Complex(uspr, 0),
	],
	({x: a, y: b})=> [
		new Complex(a, b).mul(2).sub(50).abs().add(0, b),
		new Complex(uspr, 0),
	],
]



class Complex {
	constructor(a, b = 0) {
		if (a && a instanceof Complex) {
			this.a = a.a
			this.b = a.b
		} else {
			this.a = a
			this.b = b
		}
		return this
	}
	add (_qa, _qb) {
		const q = new Complex(_qa, _qb)
		q.a += this.a
		q.b += this.b
		return q
	}
	sub (_qa, _qb) {
		const q = new Complex(_qa, _qb)
		q.a = this.a - q.a
		q.b = this.b - q.b
		return q
	}
	mul (_qa, _qb = _qa) {
		const q = new Complex(_qa, _qb)
		const a = (this.a*q.a) - (this.b*q.b)
		const b = (this.a*q.b) + (this.b*q.a)
		q.a = a
		q.b = b
		return q
	}
	abs () {
		const q = new Complex(0)
		q.a = dist({x: this.a, y: this.b})
		return q
	}
	map (fna) {
		return new Complex(fna(this))
	}
	mapEach (fna) {
		return new Complex(fna(this.a), fna(this.b))
	}
	dist (_qa = 0, _qb) {
		const q = new Complex(_qa, _qb)
		const d = sqrt(pow(this.a-q.a, 2)+pow(this.b-q.b, 2))
		q.a = d
		q.b = 0
		return q
	}
}
const toc = v=> Math.round(Math.max(0, Math.min(v, 1))*100)
const dist = (a, b = {x: 0, y: 0})=> sqrt(pow(a.x-b.x, 2)+pow(a.y-b.y, 2))
const rnd = (min, max)=> min+Math.random()*(max-min)
const rndp = ()=> ({x: rnd(-1,1)*ourOrigo.x, y: rnd(-1,1)*ourOrigo.x})

const drawOurPoint = (ourCord, r)=> drawPoint(ourOrigoToSysOrigo(ourCord), r)
const drawPoint = (cord, r=10)=> ellipse(cord.x, cord.y, r*2, r*2)


const sysOrigo = {x: 0, y: 0}
const ourOrigo = {x: 300, y: 300}
const ourOrigoToSysOrigo = ({x, y})=> {
	// const target = 150
	const scale = 1 //ourOrigo.x/target
	const sysCord = {x: x*scale+ourOrigo.x, y: y*scale+ourOrigo.y}
	return sysCord
}
