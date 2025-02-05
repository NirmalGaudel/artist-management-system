const express = require('express');
const { getUsers, getUserById, updateUser, createUser, deleteUser } = require('../controllers/userController');
const { authorize,authenticate } = require('../middlewares/auth');
const router = express.Router();

router.get("/", authenticate, authorize(['super_admin']), getUsers);
router.get("/:id", authenticate, authorize(['super_admin']), getUserById);
router.put("/:id", authenticate, authorize(['super_admin']), updateUser);
router.post("/", authenticate, authorize(['super_admin']), createUser);
router.delete("/:id", authenticate, authorize(['super_admin']), deleteUser);

module.exports = router;
