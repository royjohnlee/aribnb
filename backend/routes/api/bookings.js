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

    return res.json(booking)

});

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


module.exports = router;
