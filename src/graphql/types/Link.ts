import { extendType, intArg, nonNull, objectType, stringArg } from "nexus";
import { User } from "./User";

export const Link = objectType({
	name: "Link",
	definition(t) {
		t.nonNull.string("id");
		t.string("title");
		t.string("url");
		t.string("description");
		t.string("imageUrl");
		t.string("category");
		t.list.field("users", {
			type: User,
			async resolve(parent, _args, ctx) {
				return await ctx.prisma.link
					.findUnique({
						where: {
							id: parent.id,
						},
					})
					.Users();
			},
		});
	},
});

// Implementating Pagination
export const Edge = objectType({
	name: "Edge",
	definition(t) {
		t.string("cursor");
		t.field("node", {
			type: Link,
		});
	},
});

export const PageInfo = objectType({
	name: "PageInfo",
	definition(t) {
		t.string("endCursor");
		t.boolean("hasNextPage");
	},
});

export const Response = objectType({
	name: "Response",
	definition(t) {
		t.field("pageInfo", {
			type: PageInfo,
		});
		t.list.field("edges", {
			type: Edge,
		});
	},
});
// End Pagination

export const LinksQuery = extendType({
	type: "Query",
	definition(t) {
		t.field("links", {
			type: "Response",
			args: {
				first: nonNull(intArg()),
				after: stringArg(),
			},
			async resolve(_, args, ctx) {
				let queryResults = null;

				if (args.after) {
					queryResults = await ctx.prisma.link.findMany({
						take: args.first,
						skip: 1,
						cursor: {
							id: args.after,
						},
					});
				} else {
					queryResults = await ctx.prisma.link.findMany({
						take: args.first,
					});
				}

				if (queryResults.length == 0) {
					return {
						pageInfo: {
							endCursor: null,
							hasNextPage: false,
						},
						edges: [],
					};
				}

				const lastLinkInResults = queryResults[queryResults.length - 1];

				const myCursor = lastLinkInResults.id;

				const secondQueryResults = await ctx.prisma.link.findMany({
					take: args.first,
					cursor: {
						id: myCursor,
					},
				});

				const result = {
					pageInfo: {
						endCursor: myCursor,
						hasNextPage: secondQueryResults.length >= 2,
					},
					edges: queryResults.map((link) => ({
						cursor: link.id,
						node: link,
					})),
				};

				return result;
			},
		});
	},
});

export const GetLinkById = extendType({
	type: "Query",
	definition(t) {
		t.nonNull.field("link", {
			type: "Link",
			args: {
				id: nonNull(stringArg()),
			},
			async resolve(_parent, { id }, ctx) {
				const link = await ctx.prisma.link.findUnique({
					where: {
						id: id,
					},
				});

				if (!link)
					throw new Error("The Link you're looking for was't found");

				return link;
			},
		});
	},
});

export const CreateLinkMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("createLink", {
			type: Link,
			args: {
				title: nonNull(stringArg()),
				url: nonNull(stringArg()),
				imageUrl: nonNull(stringArg()),
				category: nonNull(stringArg()),
				description: nonNull(stringArg()),
			},
			async resolve(_parent, args, ctx) {
				if (!ctx.user) {
					throw new Error(
						"You need to be logged in to perform an action"
					);
				}

				const user = await ctx.prisma.user.findUnique({
					where: {
						email: ctx.user!.email,
					},
				});

				if (!user || user.rule !== "admin") {
					throw new Error(
						"You do not have permission to perform action"
					);
				}

				const newLink = {
					title: args.title,
					url: args.url,
					imageUrl: args.imageUrl,
					category: args.category,
					description: args.description,
				};

				return await ctx.prisma.link.create({
					data: newLink,
				});
			},
		});
	},
});

export const UpdateLinkMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("updatedLink", {
			type: "Link",
			args: {
				id: nonNull(stringArg()),
				title: stringArg(),
				url: stringArg(),
				imageUrl: stringArg(),
				category: stringArg(),
				description: stringArg(),
			},
			async resolve(_parent, args, ctx) {
				return await ctx.prisma.link.update({
					where: { id: args.id },
					data: {
						...(args.title ? { title: args.title } : {}),
						...(args.url ? { url: args.url } : {}),
						...(args.imageUrl ? { imageUrl: args.imageUrl } : {}),
						...(args.category ? { category: args.category } : {}),
						...(args.description
							? { description: args.description }
							: {}),
					},
				});
			},
		});
	},
});

export const DeleteLinkMutation = extendType({
	type: "Mutation",
	definition(t) {
		t.nonNull.field("deletedLink", {
			type: "Link",
			args: {
				id: nonNull(stringArg()),
			},
			async resolve(_parent, args, ctx) {
				return ctx.prisma.link.delete({
					where: {
						id: args.id,
					},
				});
			},
		});
	},
});

export const UserBookmarks = extendType({
	type: "Query",
	definition(t) {
		t.list.field("bookmarks", {
			type: "Link",
			async resolve(_, _args, ctx) {
				if (!ctx.user) throw new Error("You most be loged in");

				const user = await ctx.prisma.user.findUnique({
					where: {
						email: ctx.user.email,
					},
					include: {
						Bookmarks: true,
					},
				});

				if (!user) throw new Error("Invalid user");

				return user.Bookmarks;
			},
		});
	},
});

export const BookmarkLink = extendType({
	type: "Mutation",
	definition(t) {
		t.field("bookmarkLink", {
			type: "Link",
			args: {
				linkId: nonNull(stringArg()),
			},
			async resolve(_, { linkId }, ctx) {
				if (!ctx.user) throw new Error("You most be loged in");

				const link = await ctx.prisma.link.findUnique({
					where: {
						id: linkId,
					},
				});

        if (!link) throw new Error("Link not found!");

        await ctx.prisma.user.update({
          where: {
            email: ctx.user.email
          },
          data:{
            Bookmarks: {
              connect: {
                id: link?.id
              }
            }
          }
        });

        return link
			},
		});
	},
});
