const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage } = require('../../db/models');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = +req.params.imageId
    const userId = req.user.dataValues.id

    const currReviewImage = await ReviewImage.findOne({ where: { id: imageId } })

    if (!currReviewImage) {
        res.status(404)
        return res.json({
            "message": "Review Image couldn't be found",
            "statusCode": 404
        });
    };

    console.log(currReviewImage)
    const reviewCheck = await Review.findByPk(currReviewImage.reviewId)



    console.log("eaouuuuuuuu", userId)
    console.log(reviewCheck)

    if (userId !== reviewCheck.userId) {
        res.status(403)
        return res.json({
            "message": "Review must belong to the current user"
        });
    };

    await currReviewImage.destroy();

    res.status(200)
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
});

module.exports = router;
