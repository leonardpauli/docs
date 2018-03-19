// npm i -S aws-sdk
const AWS = require('aws-sdk')
const config = require('./config')


const s3 = new AWS.S3({
	accessKeyId: config.s3.key,
	secretAccessKey: config.s3.secret,
	region: config.s3.region,
})


const rndStr = ()=> Math.random().toString(16).substr(2)
const kindValid = k=> validKinds.indexOf(k)>=0
const escapedSuffix = s=> s.toLowerCase().replace(/[^a-z0-9\._-]+/ig, '')
// TODO: valid content types?


const getPresignedUrl = ({
	contentType = 'image/jpeg', kind = 'upload', suffix = '',
})=> new Promise((res, rej)=> !kindValid(kind)? rej('invalid kind')
	: s3.getSignedUrl('putObject', {
		Bucket: config.s3.bucket,
		Key: `${s3.folder}/${kind}/${rndStr()}${escapedSuffix(suffix)}`,
		ContentType: contentType,
	}, (err, url)=> err? rej(err): res(url)))


module.exports = {getPresignedUrl}
