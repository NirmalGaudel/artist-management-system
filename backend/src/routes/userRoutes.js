const express = require('express');
const { getUsers, getUserById, updateUser, createUser, deleteUser } = require('../controllers/userController');
const { authorize,authenticate } = require('../middlewares/auth');
const { userUpdateValidor, userDataValidation } = require('../validators/userValidator');
const router = express.Router();

router.get("/", authenticate, authorize(['super_admin']), getUsers);
router.get("/profile", authenticate, authorize(['super_admin']), (req, res) => res.send(req.user));
router.get("/:id", authenticate, authorize(['super_admin']), getUserById);
router.put("/:id", authenticate, authorize(['super_admin']), userUpdateValidor, updateUser);
router.post("/", authenticate, authorize(['super_admin']), userDataValidation, createUser);
router.delete("/:id", authenticate, authorize(['super_admin']), deleteUser);


module.exports = router;
