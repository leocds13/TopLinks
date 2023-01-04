import { gql, useQuery } from "@apollo/client";
import { FC } from "react";
import { Card } from "../components/Card";
import { Link } from "@prisma/client";

const BookmarksQuery = gql`
	query Bookmark {
		bookmarks {
			id
			title
			url
			imageUrl
			description
			category
		}
	}
`;

type BookmarksQueryResult = {
	bookmarks: Link[];
};

const Favorites: FC = () => {
	const { data, loading, error } =
		useQuery<BookmarksQueryResult>(BookmarksQuery);

	if (error) return <p>Oops! SOmething went wrong {error.message}</p>;

	return (
		<div className="mx-auto my-20 max-w-5xl px-10">
			<h1 className="text-3xl font-medium my-5">My Favorites</h1>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{data && data.bookmarks.length > 0 ? (
                        data.bookmarks.map((link) => (
						<Card
							key={link.id}
							id={link.id}
							category={link.category}
							imageUrl={link.imageUrl}
							title={link.title}
							description={link.description}
							url={link.url}
						/>
					))): (
                        <p className="text-2xl font-medium">
                            You haven&apos;t bookmarked any links yet 👀
                        </p>
                    )}
				</div>
			)}
		</div>
	);
};

export default Favorites;