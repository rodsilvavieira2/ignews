import Prismic from "@prismicio/client";

export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(process.env.PRISMA_ENDPOINT, {
    req,
    accessToken: process.env.PRISMA_KEY,
  });

  return prismic;
}
