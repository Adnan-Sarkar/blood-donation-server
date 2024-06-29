import prisma from "../../utils/prismaClient";
import { TBloodDonationEventType } from "../../types/bloodDonationEvent.type";
import TJWTPayload from "../../types/jwtPayload.type";

// create event
const createBloodDonationEvent = async (payload: TBloodDonationEventType) => {
    return await prisma.bloodDonationEvent.create({
        data: payload
    });
}

// registration event
const registrationBloodDonationEvent = async (user: TJWTPayload, eventId: string) => {
    const result = await prisma.eventRegistrations.create({
        data: {
            userId: user.id,
            eventId
        }
    });

    return result;
}

export const EventService = {
    createBloodDonationEvent,
    registrationBloodDonationEvent
}