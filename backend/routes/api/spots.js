const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage } = require('../../db/models');
const router = express.Router();


//GET Spots of CURRENT User
router.get('/current', requireAuth, async (req, res) => {
    console.log(Spot)
})


// GET all Spots  =========================================================================================
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    });

    let spotListArr = [];
    spots.forEach(spot => {
        // console.log("EACH SPOT:================ ", spot.toJSON())
        spotListArr.push(spot.toJSON())
    });
    // console.log("spotListArr: ", spotListArr)
    spotListArr.forEach(spot => {
        let starTotalSum = 0;
        let count = 0;
        spot.Reviews.forEach(review => {

            // console.log(`review.spotId:======= ${review.spotId} review.stars:=====  ${review.stars}`)
            starTotalSum += review.stars
            count++
        })
        const avgStarsPerSpot = starTotalSum / count
        // console.log("average review Id: ", avgStarsPerSpot)
        spot.avgRating = avgStarsPerSpot
        delete spot.Reviews
    })

    spotListArr.forEach(spot => {
        spot.SpotImages.forEach(image => {
            if (image.preview) {
                spot.previewImage = image.url
            } else {
                spot.previewImage = "needs an image"
            }
            delete spot.SpotImages
        })

    })
    return res.json({ "Spots": spotListArr })
});

// CREATE an Image for a Spot =========================================================================================
router.post('/:spotId/images', requireAuth, async (req, res) => {

    const { url, preview } = req.body
    const spot = await Spot.findByPk(req.params.spotId)

    console.log("===============================================")
    console.log(spot)

    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    const spotId = spot.id

    // console.log("===============================================")
    // console.log(spotId)

    const newSpotImage = await SpotImage.create({
        spotId,
        url,
        preview
    })

    // console.log("ahoeuthaoeut", newSpotImage)

    return res.json({ "id": newSpotImage.id, "url": newSpotImage.url, "preview": newSpotImage.preview })
});




// CREATE a SPOT  ====================================================================================================
router.post('/', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const dataArr = [address, city, state, country, lat, lng, name, description, price]

    console.log("DATA USER VALUE ID", req.user.dataValues.id)


    dataArr.forEach(data => {
        if (!data) {
            res.json({
                message: "Validation Error",
                statusCode: 400,
                errors: {
                    address: "Street address is required",
                    city: "City is required",
                    state: "State is required",
                    country: "Country is required",
                    lat: "Latitude is not valid",
                    lng: "Longitude is not valid",
                    name: "Name must be less than 50 characters",
                    description: "Description is required",
                    price: "Price per day is required"
                }
            });
        }
    });

    const newSpot = await Spot.create({
        ownerId: req.user.dataValues.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    return res.json(newSpot)

})






module.exports = router;
