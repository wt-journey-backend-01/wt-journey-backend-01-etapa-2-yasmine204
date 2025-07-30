const express = require('express');
const router = express.Router();
const controller = require('../controllers/agentesController');

router.get('/', controller.getAgentes);
router.get('/:id', controller.getAgentesById);
router.post('/', controller.createAgente);
router.put('/:id', controller.updateCompletelyAgente);
router.patch('/:id', controller.partiallyUpdateAgente);
router.delete('/:id', controller.deleteAgente);

module.exports = router;