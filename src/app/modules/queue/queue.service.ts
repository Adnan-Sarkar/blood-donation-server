import { Queue } from "bullmq";
import redis from "../../lib/redis";
import logger from "../../lib/logger";
import { TJobName, TJobPayload } from "./queue.types";

const QUEUE_NAME = "blood-donation-notifications";

const createQueue = (): Queue<TJobPayload> | null => {
  if (!redis) return null;

  return new Queue<TJobPayload>(QUEUE_NAME, {
    connection: redis,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 50 },
    },
  });
};

const notificationQueue = createQueue();

const enqueueJob = async (
  name: TJobName,
  payload: TJobPayload
): Promise<void> => {
  if (!notificationQueue) {
    logger.debug("Queue is not available. Skipping job enqueue.", {
      jobName: name,
    });
    return;
  }

  try {
    await notificationQueue.add(name, payload);
    logger.debug("Job enqueued successfully", { jobName: name });
  } catch (err) {
    logger.error("Failed to enqueue job", {
      jobName: name,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const QueueService = {
  notificationQueue,
  enqueueJob,
};
