// cd .. && npm i dotenv
// touch .env.example && vi .env.example
// mv .env.example .env && vi .env
// echo .env >> .gitignore
require('dotenv').config()

const {
	PORT = '3000',
	LOGGING = 'true',

	S3_KEY,
	S3_SECRET,
	S3_REGION,
	S3_BUCKET,
	S3_FOLDER,
	S3_VALIDKINDS = 'avatar,bg,upload'.split(','),
} = process.env

const config = {
	s3: {
		key: S3_KEY, secret: S3_SECRET, region: S3_REGION,
		bucket: S3_BUCKET, folder: S3_FOLDER, validKinds: S3_VALIDKINDS,
	},
	app: {
		port: parseInt(PORT, 10),
		logging: LOGGING==='true',
	},
}

module.exports = config
