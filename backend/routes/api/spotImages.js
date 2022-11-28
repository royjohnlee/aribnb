const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage } = require('../../db/models');

const router = express.Router();


router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = +req.params.imageId
    const userId = req.user.dataValues.id

    const currSpotImage = await SpotImage.findOne({ where: { id: imageId } })

    if (!currSpotImage) {
        res.status(404)
        return res.json({
            "message": "Spot Image couldn't be found",
            "statusCode": 404
        })
    }

    const spotCheck = await Spot.findByPk(currSpotImage.spotId)

    if (userId !== spotCheck.ownerId) {
        res.status(403)
        return res.json({
            "message": "Spot must belong to the current user",
            "statusCode": 403
        })
    }

    await currSpotImage.destroy();

    res.status(200)
    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})




module.exports = router;
