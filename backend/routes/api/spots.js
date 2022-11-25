const express = require('express');
const { Spot, Review, } = require('../../db/models');
const router = express.Router();


// GET all Spot
router.get('/', async (req, res) => {
    const Spots = await Spot.findAll({
        include: [
            {
                model: Review,
            }
        ]
    })
    console.log(Spots)

    // avgReviews = average of star ratings on reviews for that spot

    // previewImage = query to spotimages where spotId = spot.id AND preview: true

    res.json(Spots)
});



// Get details of a Spot from an id
// router.get('/:spotId', async (req, res) => {
//     const Spots = await Spot.findAll()
//     const id = req.params: spotId

//     res.json({})
// });

// GET all Spot owned by Current User




module.exports = router;
