import { NextApiHandler } from "next";
import { prisma } from "../../../libs/prisma";

const handler: NextApiHandler = async (req, res) => {
	const { email, secret } = req.body;

	if (req.method !== "POST") {
		return res.status(403).json({ message: "Method not allowed" });
	}

	if (secret !== process.env.AUTH0_HOOK_SECRET) {
		return res
			.status(403)
			.json({ message: "You must provide the right secret" });
	}

	if (email) {
		try {
			await prisma.user.create({
				data: {
					email,
					name: email,
				},
			});
		} catch (error) {
			console.error("Auth/hook", error);
		}

		return res.status(200).json({
			message: `User with email: ${email} has been created successfully!`,
		});
	}
};

export default handler;
