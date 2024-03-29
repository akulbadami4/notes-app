const express = require('express');
const router = express.Router();
const {authenticate} = require('../middlewares/authMiddleware');

router.use(express.urlencoded({extended:true}));
router.use(express.json());
router.use(authenticate);

const {getAllNotes,getNotesById,saveNewNote,updateNote,deleteNote,shareNote,searchNote,contextSearchText} =  require('../controllers/notesController');

router.get('/',searchNote);

router.get('/contextSearchText',contextSearchText);
module.exports = router;