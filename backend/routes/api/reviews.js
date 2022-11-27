const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage } = require('../../db/models');

const router = express.Router();


router.post('/:reviewId/images', requireAuth, async (req, res) => {

    const { url } = req.body

    const review = await Review.findByPk(req.params.reviewId, {
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
});


module.exports = router;
