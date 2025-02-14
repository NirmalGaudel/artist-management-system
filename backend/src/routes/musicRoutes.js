const express = require('express');
const { getMusics, getMusicById, updateMusic, createMusic, deleteMusic } = require('../controllers/musicController');
const { authorize, authenticate } = require('../middlewares/auth');
const { musicUpdateValidator, musicDataValidator } = require('../validators/musicValidator');

const router = express.Router();

router.get("/", authenticate, authorize(['super_admin', 'artist_manager']), getMusics);
router.get("/:id", authenticate, authorize(['super_admin', 'artist_manager']), getMusicById);
router.put("/:id", authenticate, authorize(['super_admin', 'artist_manager']), musicUpdateValidator, updateMusic);
router.post("/", authenticate, authorize(['super_admin', 'artist_manager']), musicDataValidator, createMusic);
router.delete("/:id", authenticate, authorize(['super_admin', 'artist_manager']), deleteMusic);

module.exports = router;