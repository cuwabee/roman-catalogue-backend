const express = require('express');
const router = express.Router();
const novelController = require('../controllers/novelController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { validateSearchParams } = require('../middleware/novelValidation');

// Route publique pour rechercher des romans
router.get('/search', validateSearchParams, validate, novelController.searchNovels);

// Route publique pour obtenir la liste des genres
router.get('/genres', novelController.getGenres);

// Route publique pour obtenir tous les romans
router.get('/', novelController.getNovels);

// Route publique pour obtenir un roman spécifique
router.get('/:id', novelController.getNovelById);

// Routes protégées nécessitant une authentification
router.post('/', auth, novelController.createNovel);
router.put('/:id', auth, novelController.updateNovel);
router.delete('/:id', auth, novelController.deleteNovel);

module.exports = router;