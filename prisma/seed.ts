import { PrismaClient } from "@prisma/client";
// import { data } from '../data/links'
const prisma = new PrismaClient();

async function main() {
	await prisma.user.create({
		data: {
			email: `testemail@gmail.com`,
			name: "admin",
			rule: "admin",
		},
	});

	await prisma.link.createMany({
		data: [
			{
				title: "Teste1",
				description: "Description1",
				category: "Teste",
				url: "http://test.com",
				imageUrl: "",
			},
			{
				title: "Teste2",
				description: "Description2",
				category: "Teste",
				url: "http://test.com",
				imageUrl: "",
			},
			{
				title: "Teste3",
				description: "Description3",
				category: "Teste",
				url: "http://test.com",
				imageUrl: "",
			},
			{
				title: "Google",
				description: "Search Anything you want!",
				category: "Search",
				url: "https://google.com/",
				imageUrl: "/imagens/google.png",
			},
		],
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
