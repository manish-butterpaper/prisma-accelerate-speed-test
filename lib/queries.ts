import { prisma } from "./prisma";

export async function fetchSomeData(cache: boolean): Promise<void> {
  await prisma.userProject.count({
    cacheStrategy: cache ? { ttl: 60 * 60 * 24 } : undefined,
    where: {
      User: {
        email: {
          contains: ".com"
        }
      }
    },
  });
}

interface FetchOptions {
  runHeavyQuery: boolean;
  cacheQuery: boolean;
}

export async function fecthData({ runHeavyQuery, cacheQuery }: FetchOptions) {
  const res = await prisma.userProject
    .count({
      cacheStrategy: cacheQuery ? { ttl: 60 * 60 * 24 } : undefined,
      take: runHeavyQuery ? undefined : 1,
      where: {
        User: {
          email: {
            contains: ".com"
          }
        }
      },
    })
    .withAccelerateInfo();

  const cacheStatus = res.info?.cacheStatus;
  return cacheStatus == "ttl" || cacheStatus == "swr" ? 1 : 0;
}
