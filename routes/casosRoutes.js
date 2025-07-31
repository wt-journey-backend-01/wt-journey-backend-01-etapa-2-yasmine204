const express = require('express');
const router = express.Router();
const controller = require('../controllers/casosController');

//router.get('/search', controller.searchCasos);

router.get('/', controller.getCasos);
router.get('/:id', controller.getCasoById);
router.post('/', controller.createCaso);
router.put('/:id', controller.updateCompletelyCaso);
router.patch('/:id', controller.partiallyUpdateCaso);
router.delete('/:id', controller.deleteCaso);

router.get('/:id/agente', controller.getAgenteByCasoId);


module.exports = router;