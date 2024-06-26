import prisma from "../../utils/prismaClient";
import { TBloodDonationEventType } from "../../types/bloodDonationEvent.type";

// create event
const createBloodDonationEvent = async (payload: TBloodDonationEventType) => {
    return await prisma.bloodDonationEvent.create({
        data: payload
    });
}

export const EventService = {
    createBloodDonationEvent
}