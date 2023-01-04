import { PrismaClient } from "@prisma/client";
import { prisma } from "../libs/prisma";
import { Claims, getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next/types";

export type Context = {
	user?: Claims;
	accessToken?: string;
	prisma: PrismaClient;
};

async function createContext({
	req,
	res,
}: {
	req: NextApiRequest;
	res: NextApiResponse;
}): Promise<Context> {
	const session = await getSession(req, res);
	
	if (!session) return { prisma };

	const { user, accessToken } = session;

	return {
		user,
		accessToken,
		prisma,
	};
}

export { createContext };
