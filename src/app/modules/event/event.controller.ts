import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import {EventService} from "./event.service";

// create event
const createBloodDonationEvent = catchAsync(async (req, res) => {
    const result = await EventService.createBloodDonationEvent(req.body);

    sendResponse(res, true, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Blood Donation event Created successfully",
        data: result,
    });
});

export const EventController = {
    createBloodDonationEvent
}