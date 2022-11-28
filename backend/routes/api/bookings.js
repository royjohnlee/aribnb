const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Booking, SpotImage } = require('../../db/models');

const router = express.Router();


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
