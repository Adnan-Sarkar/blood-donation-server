import { Worker, Job } from "bullmq";
import redis from "../../lib/redis";
import logger from "../../lib/logger";
import { getIo } from "../../lib/socket";
import { JobName, TJobPayload } from "./queue.types";

const QUEUE_NAME = "blood-donation-notifications";

const processJob = async (job: Job<TJobPayload>): Promise<void> => {
  const io = getIo();

  switch (job.data.type) {
    case JobName.WELCOME_NOTIFICATION: {
      logger.info("Processing WELCOME_NOTIFICATION job", {
        jobId: job.id,
        userId: job.data.userId,
        email: job.data.email,
      });
      io?.to(`user:${job.data.userId}`).emit("notification", {
        type: JobName.WELCOME_NOTIFICATION,
        message: `Welcome to the platform, ${job.data.name}!`,
        timestamp: new Date().toISOString(),
      });
      break;
    }

    case JobName.DONATION_REQUEST_NOTIFICATION: {
      logger.info("Processing DONATION_REQUEST_NOTIFICATION job", {
        jobId: job.id,
        donorId: job.data.donorId,
        requestId: job.data.requestId,
      });
      io?.to(`user:${job.data.donorId}`).emit("notification", {
        type: JobName.DONATION_REQUEST_NOTIFICATION,
        message: `You have a new donation request for ${job.data.hospitalName} on ${job.data.dateOfDonation}.`,
        requestId: job.data.requestId,
        timestamp: new Date().toISOString(),
      });
      break;
    }

    case JobName.REQUEST_STATUS_UPDATE: {
      logger.info("Processing REQUEST_STATUS_UPDATE job", {
        jobId: job.id,
        requestId: job.data.requestId,
        newStatus: job.data.newStatus,
      });
      io?.to(`user:${job.data.requesterId}`).emit("notification", {
        type: JobName.REQUEST_STATUS_UPDATE,
        message: `Your donation request has been ${job.data.newStatus.toLowerCase()}.`,
        requestId: job.data.requestId,
        newStatus: job.data.newStatus,
        timestamp: new Date().toISOString(),
      });
      break;
    }

    default: {
      const exhaustiveCheck: never = job.data;
      logger.warn("Received unknown job type", { data: exhaustiveCheck });
    }
  }
};

const createWorker = (): Worker<TJobPayload> | null => {
  if (!redis) return null;

  const worker = new Worker<TJobPayload>(QUEUE_NAME, processJob, {
    connection: redis,
    autorun: false,
  });

  worker.on("completed", (job: Job<TJobPayload>) => {
    logger.info("Job completed", { jobId: job.id, jobName: job.name });
  });

  worker.on("failed", (job: Job<TJobPayload> | undefined, err: Error) => {
    logger.error("Job failed", {
      jobId: job?.id,
      jobName: job?.name,
      error: err.message,
      attemptsMade: job?.attemptsMade,
    });
  });

  return worker;
};

export const notificationWorker = createWorker();
