import { S3, config } from "aws-sdk";
import { Credentials } from "aws-sdk/lib/credentials";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
	try {
		const s3 = new S3({
			region: process.env.AWS_REGION,
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY ?? "",
				secretAccessKey: process.env.AWS_SECRET_KEY ?? "",
			},
		});
		config.update({
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY ?? "",
				secretAccessKey: process.env.AWS_SECRET_KEY ?? "",
			},
			region: process.env.AWS_REGION,
			signatureVersion: "v4",
		});

		const post = await s3.createPresignedPost({
			Bucket: process.env.AWS_BUCKET_NAME,
			Fields: {
				key: req.query.file,
			},
			Expires: 60, //seconds
			Conditions: [
				["content-length-range", 0, 5048576], // até 1 MB
			],
		});

		return res.status(200).json(post);
	} catch (error) {
		console.error("Api: upload-image:", error);
	}
};

export default handler;
