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

// update event
const updateBloodDonationEvent = async (eventId: string, payload: Partial<TBloodDonationEventType>) => {
    await prisma.bloodDonationEvent.findUniqueOrThrow({
        where: {
            id: eventId
        }
    });

    await prisma.bloodDonationEvent.update({
        where: {
            id: eventId
        },
        data: payload
    });

    return null;
}

// get all events
const getAllEvents = async () => {
    return await prisma.bloodDonationEvent.findMany();
}

// get single event
const getSingleEvent = async (eventId: string) => {
    return await prisma.bloodDonationEvent.findUniqueOrThrow({
        where: {
            id: eventId
        }
    });
}

export const EventService = {
    createBloodDonationEvent,
    registrationBloodDonationEvent,
    updateBloodDonationEvent,
    getAllEvents,
    getSingleEvent
}