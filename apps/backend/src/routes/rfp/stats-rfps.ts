import { type FastifyInstance } from "fastify";
import { authenticate } from "../../middleware/authenticate";
import { db } from "../../db";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getLast7Days() {
  const now = new Date();
  const result: Array<{ date: Date; label: string }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    result.push({ date: getStartOfDay(d), label: DAYS[d.getDay()] ?? 'Unknown' });
  }
  return result;
}

export async function rfpStatsRoute(fastify: FastifyInstance) {
  fastify.get(
    "/api/rfp/stats",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const rfps = await db.rFP.findMany({
        where: { company_id: request.companyId },
        select: {
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const total = rfps.length;
      const accepted = rfps.filter((r) => r.status === "Accepted").length;
      const rejected = rfps.filter((r) => r.status === "Rejected").length;
      const pending = rfps.filter((r) => r.status === "Pending").length;
      const processing = rfps.filter((r) => r.status === "Processing").length;

      const weeklyDays = getLast7Days();
      const weekly = weeklyDays.map(({ date, label }) => {
        const count = rfps.filter((r) => {
          const created = getStartOfDay(new Date(r.createdAt));
          return created.getTime() === date.getTime();
        }).length;
        return { day: label, count };
      });

      const statusDistribution = {
        accepted,
        rejected,
        pending,
        processing,
      };

      const stats = {
        total,
        accepted,
        rejected,
        pending,
        processing,
        totalChange: 0,
        acceptedChange: 0,
        rejectedChange: 0,
        pendingChange: 0,
      };

      return { ok: true, stats, weekly, statusDistribution };
    }
  );
}
