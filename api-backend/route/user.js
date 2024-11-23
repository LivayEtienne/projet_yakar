const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/user');
const auth = require('../middleware/auth');
const role = require('../middleware/roles');  



// Routes CRUD
router.post('/signup', userCtrl.signup);  
router.get('/:id', userCtrl.getUser);     
router.get('/',  userCtrl.getAllUsers);    
router.put('/:id', userCtrl.updateUser);  
router.delete('/:id', userCtrl.deleteUser); 
router.post('/login', userCtrl.login);
router.post('/loginCode', userCtrl.loginCode);
router.post('/logout', userCtrl.logout);
router.put('/changeRole/:id', userCtrl.updateRole);  
router.patch('/archive/:id', userCtrl.archive);

module.exports = router;
