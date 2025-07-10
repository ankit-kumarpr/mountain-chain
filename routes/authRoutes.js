const express = require('express');
const router = express.Router();
const {
    RegisterAdmin,
  RegisterotherRoles,
  SetPassword,
  ResendEmailToAnyRole,
  LoginAnyUser,
  DeleteAnyUser
} = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register-admin', RegisterAdmin);
router.post('/create-user', protect, authorizeRoles('Admin'), RegisterotherRoles);
router.post('/login', LoginAnyUser);
router.post('/set-password/:email', SetPassword);
router.post('/resend-email/:email', ResendEmailToAnyRole);
router.delete('/delete-user/:id', protect, authorizeRoles('Admin'), DeleteAnyUser);

module.exports = router;