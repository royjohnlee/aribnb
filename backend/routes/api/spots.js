const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');
const { json } = require('sequelize');
const router = express.Router();



//GET Spots of CURRENT User
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id

    let currSpot = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
        where: {
            ownerId: userId
        }
    })
    currSpot = JSON.parse(JSON.stringify(currSpot))
    // console.log("currSpot", currSpot)


    currSpot.forEach((spot) => {
        const reviewArr = spot.Reviews
        let starTotalSum = 0;
        let count = 0;

        console.log(spot.Reviews)
        reviewArr.forEach((review) => {
            starTotalSum += review
            count++
        });

        const avgStarsPerSpot = starTotalSum / count

        spot.avgRating = avgStarsPerSpot
        delete spot.Reviews
    })

    currSpot.forEach((spot) => {
        spot.SpotImages.forEach(image => {
            if (image.preview) {
                spot.previewImage = image.url
            } else {
                spot.previewImage = "needs an image"
            }
            delete spot.SpotImages
        })
    })
    return res.json({ "Spots": currSpot })
})


// GET details of a Spot from an id
router.get('/:spotId', async (req, res) => {

    let spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            },
            {
                model: User,
                as: "Owner",
            }
        ]
    });

    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    };

    spot = JSON.parse(JSON.stringify(spot))

    const reviewsArr = spot.Reviews

    let starTotalSum = 0;
    let count = 0;
    reviewsArr.forEach((review) => {
        starTotalSum += review
        count++
    });

    delete spot.Reviews
    console.log("SpotImage:  ", spot.SpotImages);


    const avgStarsPerSpot = starTotalSum / count;

    spot.numReviews = count;
    spot.avgRating = avgStarsPerSpot;

    const SImage = spot.SpotImages;
    SImage.forEach((image) => {
        delete image.spotId
        delete image.createdAt
        delete image.updatedAt
    });

    delete spot.Owner.username;

    return res.json(spot);
})


// GET all Spots
router.get('/', async (req, res) => {
    let spots = await Spot.findAll({
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

// CREATE an Image for a Spot
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




// CREATE a SPOT
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

// EDIT a Spot
router.put('/:spotId', requireAuth, async (req, res) => {

})






module.exports = router;
