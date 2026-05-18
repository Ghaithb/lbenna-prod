/** Lightweight liveness probe (no Nest/Prisma). */
export default function handler(_req: unknown, res: { status: (n: number) => { json: (b: object) => void } }) {
  res.status(200).json({
    alive: true,
    databaseUrlConfigured: Boolean(process.env.DATABASE_URL),
  });
}
