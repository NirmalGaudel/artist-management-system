const express = require('express');
const { authorize,authenticate } = require('../middlewares/auth');
const { getArtists, getArtistById, updateArtist, createArtist, deleteArtist, importArtists, exportArtists } = require('../controllers/artistController');
const router = express.Router();
const multer = require('multer');
const { artistUpdateValidator, artistDataValidator } = require('../validators/artistValidator');
const upload = multer({ dest: 'uploads/' });

router.get("/", authenticate, authorize(['super_admin', 'artist_manager']), getArtists);
router.get("/export", authenticate, authorize(['super_admin', 'artist_manager']), exportArtists);
router.get("/:id", authenticate, authorize(['super_admin', 'artist_manager']), getArtistById);
router.put("/:id", authenticate, authorize(['super_admin', 'artist_manager']), artistUpdateValidator, updateArtist);
router.post("/", authenticate, authorize(['super_admin', 'artist_manager']), artistDataValidator, createArtist);
router.post("/import", authenticate, authorize(['super_admin', 'artist_manager']), upload.single('file'), importArtists);
router.delete("/:id", authenticate, authorize(['super_admin', 'artist_manager']), deleteArtist);

module.exports = router;
