import prisma from "../../utils/prismaClient";
import { TBloodDonationEventType } from "../../types/bloodDonationEvent.type";
import TJWTPayload from "../../types/jwtPayload.type";
import AppError from "../../error/AppError";
import httpStatus from "http-status";

const REGISTRATION_COOLDOWN_DAYS = 120;

// create event
const createBloodDonationEvent = async (payload: TBloodDonationEventType) => {
    const result = await prisma.bloodDonationEvent.create({
        data: payload
    });

    return result;
}

// registration event
const registrationBloodDonationEvent = async (user: TJWTPayload, eventId: string) => {
    // Prevent duplicate registration for the same event
    const existing = await prisma.eventRegistrations.findUnique({
        where: {
            eventId_userId: { eventId, userId: user.id }
        }
    });

    if (existing) {
        throw new AppError(httpStatus.CONFLICT, "You are already registered for this event");
    }

    // 120-day cooldown: block if user has any registration whose event date
    // falls within the last REGISTRATION_COOLDOWN_DAYS days (or is upcoming).
    // eventDate is stored as "YYYY-MM-DD" — lexicographic comparison is correct.
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - REGISTRATION_COOLDOWN_DAYS);
    const cutoffStr = cutoff.toISOString().split("T")[0];

    const recentRegistration = await prisma.eventRegistrations.findFirst({
        where: {
            userId: user.id,
            event: {
                eventDate: { gte: cutoffStr }
            }
        },
        include: {
            event: { select: { eventDate: true, eventTitle: true } }
        }
    });

    if (recentRegistration) {
        const lastEventDate = new Date(recentRegistration.event.eventDate);
        lastEventDate.setDate(lastEventDate.getDate() + REGISTRATION_COOLDOWN_DAYS);
        const nextEligibleStr = lastEventDate.toISOString().split("T")[0];
        throw new AppError(
            httpStatus.CONFLICT,
            `You registered for "${recentRegistration.event.eventTitle}" recently. You can register for another event after ${nextEligibleStr} (${REGISTRATION_COOLDOWN_DAYS}-day cooldown).`
        );
    }

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

// get all events — includes registration count for listing cards
const getAllEvents = async () => {
    const result = await prisma.bloodDonationEvent.findMany({
        include: {
            _count: {
                select: { EventDonors: true }
            }
        }
    });

    return result;
}

// get single event — includes registrations with user details
const getSingleEvent = async (eventId: string) => {
    const result = await prisma.bloodDonationEvent.findUniqueOrThrow({
        where: {
            id: eventId
        },
        include: {
            EventDonors: {
                select: {
                    userId: true,
                    user: {
                        select: {
                            name: true,
                            bloodType: true,
                            profilePicture: true
                        }
                    }
                }
            }
        }
    });

    return result;
}

export const EventService = {
    createBloodDonationEvent,
    registrationBloodDonationEvent,
    updateBloodDonationEvent,
    getAllEvents,
    getSingleEvent
}
