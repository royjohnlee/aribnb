const express = require('express');
const { Spot, Review, SpotImage } = require('../../db/models');
const router = express.Router();


// GET all Spots
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
        console.log("average review Id: ", avgStarsPerSpot)
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


// requireAuth


// router.get('/current', requireAuth, async (req, res) => {

//     const spots = await Spot.findbyPk({
//         include: [
//             {
//                 model: Review
//             },
//             {
//                 model: SpotImage
//             }
//         ]
//     });
//     console.log(spots)
//     return res.json(spots)
// })




// Get details of a Spot from an id
// router.get('/:spotId', async (req, res) => {
//     const Spots = await Spot.findAll()


//     res.json({})
// });

// GET all Spot owned by Current User




module.exports = router;
