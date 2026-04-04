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
      
      const rejectedStatuses = ['parse_rejected', 'explore_rejected', 'summarise_rejected', 'failed', 'Rejected'];
      const pendingStatuses = ['parsed', 'exploring', 'explored', 'summarising', 'summarised', 'generating_document', 'processing', 'Pending'];

      const completed = rfps.filter((r) => r.status === "completed" || r.status === "Accepted").length;
      const rejected = rfps.filter((r) => rejectedStatuses.includes(r.status)).length;
      const pending = rfps.filter((r) => pendingStatuses.includes(r.status)).length;
      const processing = pending;

      const weeklyDays = getLast7Days();
      const weekly = weeklyDays.map(({ date, label }) => {
        const count = rfps.filter((r) => {
          const created = getStartOfDay(new Date(r.createdAt));
          return created.getTime() === date.getTime();
        }).length;
        return { day: label, count };
      });

      const statusDistribution = {
        accepted: completed,
        rejected,
        pending,
        processing,
      };

      const stats = {
        total,
        accepted: completed,
        completed,
        rejected,
        pending,
        processing,
        totalChange: 0,
        acceptedChange: 0,
        completedChange: 0,
        rejectedChange: 0,
        pendingChange: 0,
      };

      return { ok: true, stats, weekly, statusDistribution };
    }
  );
}
