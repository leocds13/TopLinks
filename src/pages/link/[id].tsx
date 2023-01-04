import { gql, useMutation } from "@apollo/client";
import { Link } from "@prisma/client";
import { GetServerSideProps } from "next";
import { FC, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

import { prisma } from "../../libs/prisma";

const BookmarkLinkMutation = gql`
	mutation BookMarkLink($linkId: String!) {
		bookmarkLink(linkId: $linkId) {
			id
			title
			description
			category
			url
			imageUrl
		}
	}
`;

type BookmarkLinkMutationVariables = {
	linkId: String;
};

type LinkPageProps = {
	link: Link;
};

const LinkPage: FC<LinkPageProps> = ({ link }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [createBookmark] = useMutation<Link, BookmarkLinkMutationVariables>(
		BookmarkLinkMutation
	);

	const bookmark = async () => {
		setIsLoading(true);
		toast.promise(
			createBookmark({
				variables: {
					linkId: link.id,
				},
			}),
			{
				loading: "Marking...",
				success: "Saved successfully! 🎉",
				error: `Something went wrong 😢 Please try again`,
			}
		);
		setIsLoading(false);
	};

	return (
		<div>
			<div className="prose container mx-auto px-8">
				<Toaster />
				<button
					onClick={() => bookmark()}
					className="my-4 captalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
				>
					{isLoading ? (
						<span className="flex items-center justify-center">
							<svg
								className="w-6 h-6 animate-spin mr-1"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
							</svg>
							Saving...
						</span>
					) : (
						<span>Bookmark</span>
					)}
				</button>
				<h1>{link.title}</h1>
				<img src={link.imageUrl} className="shadow-lg rounded-lg" />
				<p>{link.description}</p>
				<a href={`${link.url}`} className="text-blue-500">
					{link.url}
				</a>
			</div>
		</div>
	);
};

export default LinkPage;

export const getServerSideProps: GetServerSideProps<
	{ link: Partial<Link> },
	{ id: string }
> = async ({ params }) => {
	const id = params?.id;
	if (!id) throw new Error("A Id is required!");

	const link = await prisma.link.findUnique({
		where: { id },
		select: {
			id: true,
			title: true,
			category: true,
			url: true,
			imageUrl: true,
			description: true,
		},
	});

  if (!link) throw new Error("Link not founded");
  
	return {
		props: {
			link,
		},
	};
};
