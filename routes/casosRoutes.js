const express = require('express');
const router = express.Router();
const controller = require('../controllers/casosController');

router.get('/', controller.getCasos);
router.get('/:id', controller.getCasoById);
router.post('/', controller.createCaso);
router.put('/:id', controller.updateCompletelyCaso);
router.patch('/:id', controller.partiallyUpdateCaso);
router.delete('/:id', controller.deleteCaso);

module.exports = router;