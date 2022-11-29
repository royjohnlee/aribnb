const express = require('express');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { query } = require('express');


const router = express.Router();

//Get All Bookings for a Spot By Id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = +req.params.spotId
    const userId = req.user.dataValues.id

    console.log(spotId)
    console.log(userId)

    let spotCheck = await Spot.findByPk(spotId)
    if (!spotCheck) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    let SpotIdBooking = await Booking.findAll({
        include: [{
            model: User
        }, {
            model: Spot,
            require: true
        }
        ],
        where: { spotId: spotId }
    })



    SpotIdBooking = JSON.parse(JSON.stringify(SpotIdBooking))

    SpotIdBooking.forEach((booking) => {
        delete booking.User.username

        if (userId !== booking.Spot.ownerId) {
            delete booking.id
            delete booking.userId
            delete booking.createdAt
            delete booking.updatedAt
            delete booking.User
        }
        delete booking.Spot
    })



    return res.json({ "Bookings": SpotIdBooking })

    // if (!spotId) {
    //     res.status(404)
    //     return res.json({
    //         "message": "Spot couldn't be found",
    //         "statusCode": 404
    //     })
    // }

    // SpotIdBooking.forEach(booking => {
    //     delete booking.User.username
    // })
    // return res.json(SpotIdBooking)
})

// get Reviews by SpotId
router.get('/:spotId/reviews', async (req, res) => {
    const spotId = req.params.spotId

    let spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    };
    // console.log("HETOUHNETSHUsn")
    // console.log(typeof spotId)

    let currReview = await Review.findAll({
        include: [
            { model: User },
            // { model: Spot },
            { model: ReviewImage }
        ], where: {
            spotId: +spotId
        }
    })

    currReview = JSON.parse(JSON.stringify(currReview))

    currReview.forEach((review) => {
        delete review.User.username

        // delete review.Spot.description
        // delete review.Spot.createdAt
        // delete review.Spot.updatedAt

        review.ReviewImages.forEach((image) => {
            delete image.reviewId
            delete image.createdAt
            delete image.updatedAt
        });
    });
    return res.json({ "Review": currReview })
});



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

        // console.log(spot.Reviews)
        reviewArr.forEach((review) => {
            starTotalSum += review.stars
            count++
        });

        const avgStarsPerSpot = starTotalSum / count
        spot.avgRating = avgStarsPerSpot
        if (!spot.avgRating) {
            spot.avgRating = "No Ratings"
        }
        delete spot.Reviews
    })

    currSpot.forEach((spot) => {
        if (spot.SpotImages.length === 0) {
            spot.previewImage = "needs an image"
        } else {
            spot.SpotImages.forEach(image => {
                if (image.preview) {
                    spot.previewImage = image.url
                } if (!image.preview) {
                    spot.previewImage = "needs an image"
                }
            })
        }
        delete spot.SpotImages
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
        starTotalSum += review.stars
        count++
    });

    delete spot.Reviews


    const avgStarsPerSpot = starTotalSum / count;

    spot.numReviews = count;
    spot.avgRating = avgStarsPerSpot;
    if (!spot.avgRating) {
        spot.avgRating = "No Ratings"
    }

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
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query

    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page)) page = 1
    if (Number.isNaN(size)) size = 20;

    let pagination = {}

    const where = {}

    if (req.query.minLat) query.where.minLat = req.query.minLat;
    if (req.query.maxLat) query.where.maxLat = req.query.maxLat;
    if (req.query.minLng) query.where.minLng = req.query.minLng;
    if (req.query.maxLng) query.where.maxLng = req.query.maxLng;
    if (req.query.minPrice) {
        if (req.queryminPrice >= 0) {
            query.where.minPrice = req.query.minPrice;
        }
    }

    if (req.query.maxPrice) {
        if (req.query.minPrice >= 0) {
            query.where.minPrice = req.query.minPrice
        }
    }

    if (req.query.maxPrice) query.where.maxPrice = req.query.maxPrice;


    if (parseInt(page) >= 1 && parseInt(size) >= 1) {
        if (parseInt(page) > 10) {
            page = 10
        }
        if (parseInt(size) > 20) {
            size = 20
        }
        pagination.limit = size
        pagination.offset = size * (page - 1)
    }

    // const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
    // const size = req.query.size === undefined ? 20 : parseInt(req.query.size);
    // if (page >= 1 && size >= 1) {
    //     query.limit = size;
    //     query.offset = size * (page - 1);
    // } else {
    //     res.status(400)
    //     return res.json({
    //         "message": "Validation Error",
    //         "statusCode": 400,
    //         "errors": {
    //             "page": "Page must be greater than or equal to 1",
    //             "size": "Size must be greater than or equal to 1"
    //         }
    //     })
    // }

    let spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ], where,
        ...pagination
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
        if (spot.SpotImages.length === 0) {
            spot.previewImage = "needs an image"
        } else {
            spot.SpotImages.forEach(image => {
                if (image.preview) {
                    spot.previewImage = image.url
                }
            })
        }
        delete spot.SpotImages
    })

    return res.json({
        "Spots": spotListArr,
        page,
        size
    })
});


//Create an Booking based on Spot Id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body
    const spotId = +req.params.spotId
    const spot = await Spot.findByPk(spotId)
    let bookings = await Booking.findAll()


    bookings = JSON.parse(JSON.stringify(bookings))
    console.log(bookings)

    if (startDate > endDate) {
        res.status(404)
        return res.json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                endDate: "endDate cannot be on or before startDate"
            }
        })
    }

    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    };



    for (let i = 0; i < bookings.length; i++) {
        const bookingListStartDate = new Date(bookings[i].startDate)
        const bookingListEndDate = new Date(bookings[i].endDate)

        const newBookingStart = new Date(startDate)
        const newBookingEnd = new Date(endDate)

        if (newBookingStart.getTime() >= bookingListStartDate.getTime() && newBookingStart.getTime() <= bookingListEndDate.getTime()) {
            res.status(403)
            return res.json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                    "startDate": "Start date conflicts with an existing booking",
                }
            })
        } else if (newBookingEnd.getTime() >= bookingListStartDate.getTime() && newBookingEnd.getTime() <= bookingListEndDate.getTime()) {
            res.status(403)
            return res.json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                    "endDate": "End date conflicts with an existing booking"
                }
            })
        }
    }

    const userId = req.user.dataValues.id

    const newBooking = await Booking.create({
        spotId,
        userId,
        startDate: startDate,
        endDate: endDate
    })

    return res.json(newBooking)

})


// CREATE an Image for a Spot
router.post('/:spotId/images', requireAuth, async (req, res) => {

    const { url, preview } = req.body

    const spot = await Spot.findByPk(req.params.spotId)

    // console.log("===========")
    // console.log(spot)

    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    const spotId = spot.id

    const newSpotImage = await SpotImage.create({
        spotId,
        url,
        preview
    })

    return res.json({ "id": newSpotImage.id, "url": newSpotImage.url, "preview": newSpotImage.preview })
});

//Creat a Review for a Spot
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    const { review, stars } = req.body
    const requestArr = [review, stars]

    const spotId = +req.params.spotId //parseInt
    const userId = req.user.dataValues.id
    const spot = await Spot.findByPk(spotId)

    const userReview = await Review.findOne({ where: { userId, spotId } })
    // console.log(spot)

    console.log(req.query.spotId)

    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    if (userReview) {
        res.status(403)
        return res.json({
            "message": "User already has a review for this spot",
            "statusCode": 403
        })
    }

    requestArr.forEach((request) => {
        if (!request) {
            res.json({
                message: "Validation Error",
                statusCode: 400,
                errors: {
                    review: "Review text is required",
                    stars: "Stars must be an integer from 1 to 5",
                }
            })
        }

    })


    const newSpotReview = await Review.create({
        userId,
        spotId,
        review,
        stars
    })

    return res.json(newSpotReview)
})


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
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const dataArr = [address, city, state, country, lat, lng, name, description, price]

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

    let spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    };

    spot.update(
        {
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price
        }
    )
    spot = JSON.parse(JSON.stringify(spot))
    return res.json(spot)
})



router.delete('/:spotId', requireAuth, async (req, res) => {
    const spotId = +req.params.spotId
    const userId = req.user.dataValues.id

    const currSpot = await Spot.findOne({
        where: { id: spotId }
    })
    if (!currSpot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    if (userId !== currSpot.ownerId) {
        res.status(403)
        return res.json({
            "message": "Spot must belong to the current user",
            "statusCode": 403
        })
    }
    console.log(currSpot)

    await currSpot.destroy()

    res.status(200)
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})


module.exports = router;
