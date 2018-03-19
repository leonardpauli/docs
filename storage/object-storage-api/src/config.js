// cd .. && npm i dotenv
// touch .env.example && vi .env.example
// cp .env.example .env && vi .env
// echo .env >> .gitignore
require('dotenv').config()

const {
	PORT = '3000',
	LOGGING = 'true',

	S3_PROVIDER = 'aws.s3',
	S3_KEY,
	S3_SECRET,
	S3_REGION, // eg. eu-central-1, nyc3, ...
	S3_BUCKET,
	S3_FOLDER,
	S3_VALIDKINDS = 'avatar,bg,upload'.split(','),

} = process.env

const option = (values, value)=> {
	if (!values.indexOf(value))
		throw new Error(`expected .env value in [${values.join(', ')}], got ${value}`)
	return value
}

let tmp
const config = {
	s3: {
		provider: option(['aws.s3', 'digitalocean.spaces'], S3_PROVIDER),
		key: S3_KEY, secret: S3_SECRET, region: S3_REGION,
		bucket: S3_BUCKET, folder: S3_FOLDER, validKinds: S3_VALIDKINDS,
	},
	app: {
		port: parseInt(PORT, 10),
		logging: option(['true', 'false'], LOGGING)==='true',
	},
}

module.exports = config
