const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage } = require('../../db/models');

const router = express.Router();


router.post('/:reviewId/images', requireAuth, async (req, res) => {

    const { url } = req.body

    const review = await Review.findByPk(+req.params.reviewId, {
        include: [{ model: ReviewImage }]
    })

    console.log("===========")
    console.log(review)

    if (!review) {
        res.status(404)
        return res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }

    // console.log(review)
    if (review && review.ReviewImages.length >= 10) {
        res.status(403)
        return res.json({
            message: "Maximum number of images for this resource was reached",
            statusCode: 403
        })
    }

    const reviewId = review.id

    const newReviewImage = await ReviewImage.create({
        reviewId,
        url
    })

    return res.json({ "id": newReviewImage.id, "url": newReviewImage.url })
})


router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id
    console.log(userId)

    let currReview = await Review.findAll({
        include: [
            {
                model: User
            },
            {
                model: Spot
            },
            {
                model: ReviewImage
            }
        ],
        where: {
            userId: userId
        }
    })

    currReview = JSON.parse(JSON.stringify(currReview))

    // console.log(currReview[0])
    currReview.forEach(review => {
        delete review.Spot.description
        delete review.Spot.createdAt
        delete review.Spot.updatedAt

        delete review.User.username

        review.ReviewImages.forEach((image) => {
            // console.log(image.reviewId)
            delete image.reviewId
            delete image.createdAt
            delete image.updatedAt
        })
    });
    return res.json({ "Reviews": currReview })
});

router.put('/:reviewId', requireAuth, async (req, res) => {

    const { review, stars } = req.body
    console.log(req.body)
    const dataArr = [review, stars]

    let reviewTable = await Review.findByPk(req.params.reviewId)

    dataArr.forEach((data) => {
        if (!data) {
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

    console.log(reviewTable)

    if (!reviewTable) {
        res.status(404)
        return res.json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    };

    reviewTable.update(
        {
            review: review,
            stars: stars
        }
    )

    reviewTable = JSON.parse(JSON.stringify(reviewTable))

    return res.json(reviewTable)
});

module.exports = router;
