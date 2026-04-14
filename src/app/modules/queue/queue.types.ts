export const JobName = {
  WELCOME_NOTIFICATION: "WELCOME_NOTIFICATION",
  DONATION_REQUEST_NOTIFICATION: "DONATION_REQUEST_NOTIFICATION",
  REQUEST_STATUS_UPDATE: "REQUEST_STATUS_UPDATE",
} as const;

export type TJobName = (typeof JobName)[keyof typeof JobName];

export type TWelcomeNotificationPayload = {
  type: typeof JobName.WELCOME_NOTIFICATION;
  userId: string;
  email: string;
  name: string;
};

export type TDonationRequestNotificationPayload = {
  type: typeof JobName.DONATION_REQUEST_NOTIFICATION;
  donorId: string;
  requesterId: string;
  requestId: string;
  hospitalName: string;
  dateOfDonation: string;
};

export type TRequestStatusUpdatePayload = {
  type: typeof JobName.REQUEST_STATUS_UPDATE;
  requestId: string;
  requesterId: string;
  newStatus: string;
};

export type TJobPayload =
  | TWelcomeNotificationPayload
  | TDonationRequestNotificationPayload
  | TRequestStatusUpdatePayload;
