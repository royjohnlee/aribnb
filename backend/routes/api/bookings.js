const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Booking, SpotImage } = require('../../db/models');

const router = express.Router();

// Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = req.params.bookingId
    const bookingCheck = await Booking.findByPk(bookingId)

    console.log(bookingId)

    const { startDate, endDate } = req.body
    const dataArr = [startDate, endDate]

    if (endDate < startDate) {
        res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                endDate: "endDate cannot come before startDate"
            }
        })
    }
    if (!bookingCheck) {
        res.json({
            message: "Booking couldn't be found",
            statusCode: 404,
        })
    }

    let booking = await Booking.findByPk(req.params.bookingId)

    booking.update(
        {
            startDate: startDate,
            endDate: endDate
        }
    )

    return res.json(booking)

});
//Get All Current User Bookings
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id
    let currBooking = await Booking.findAll({
        include: [{
            model: Spot,
            include: [{
                model: SpotImage,
                where: { preview: true },
                attributes: ["url"]
            }]
        }],
        where: {
            userId: userId
        }
    })

    // console.log(Spot.previewImage)
    currBooking = JSON.parse(JSON.stringify(currBooking))

    currBooking.forEach(booking => {
        delete booking.Spot.description
        delete booking.Spot.createdAt
        delete booking.Spot.updatedAt

        booking.Spot.previewImage = booking.Spot.SpotImages[0].url

        delete booking.Spot.SpotImages

    });
    console.log(currBooking[0].Spot)

    return res.json({ "Bookings": currBooking })
})

router.delete('/:bookingId', requireAuth, async (req, res) => {
    const userId = req.user.dataValues.id
    const bookingId = +req.params.bookingId


    const currBooking = await Booking.findOne({ where: { id: bookingId } })

    if (!currBooking) {
        res.status(404)
        return res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }

    if (userId !== currBooking.userId) {
        res.status(403)
        return res.json({
            "message": "Review must belong to the current user"
        })
    }

    await currBooking.destroy();


    res.status(200)
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})


module.exports = router;
