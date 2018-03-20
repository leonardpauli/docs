// npm i -S aws-sdk
const AWS = require('aws-sdk')
const config = require('./config')


const s3 = new AWS.S3({
	accessKeyId: config.s3.key,
	secretAccessKey: config.s3.secret,
	// credentials: new AWS.Credentials({accessKeyId,secretAccessKey}), diff?
	region: config.s3.region,
	endpoint: config.s3.provider === 'digitalocean.spaces'
		? new AWS.Endpoint(`${config.s3.region}.digitaloceanspaces.com`)
		: void 0,
})


const rndStr = ()=> Math.random().toString(16).substr(2)
const kindValid = k=> config.s3.validKinds.indexOf(k)>=0
const escapedSuffix = s=> s.toLowerCase().replace(/[^a-z0-9\._-]+/ig, '')
// TODO: valid content types?


const getPresignedUrl = ({
	contentType = 'image/jpeg', kind = 'upload', suffix = '',
} = {})=> new Promise((res, rej)=> !kindValid(kind)? rej('invalid kind')
	: s3.getSignedUrl('putObject', {
		Bucket: config.s3.bucket,
		Key: `${config.s3.folder}/${kind?kind+'/':''}${rndStr()}${escapedSuffix(suffix)}`,
		ContentType: contentType,
	}, (err, url)=> err? rej(err): res(url)))

/*
const cb = (err, data)=> err
	? console.log(err, err.stack)
	: console.log(data)

const bucketName = 'new-unique-name' // aka space name

s3.createBucket({ Bucket: bucketName }, cb) // Create a new Space
s3.listBuckets({}, (err, data)=> { // List all Spaces in the region
	if (err) return console.log(err, err.stack)
	data.Buckets.forEach(space=> console.log(space.Name))
})
s3.putObject({ // Add a file to a Space
	Bucket: bucketName,
	Body: 'The contents of the file',
	Key: 'file.ext',
}, cb)
*/

module.exports = {getPresignedUrl}
