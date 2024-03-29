const express = require('express');
const router = express.Router();
const {authenticate} = require('../middlewares/authMiddleware');

router.use(express.urlencoded({extended:true}));
router.use(express.json());
router.use(authenticate);

const {getAllNotes,getNotesById,saveNewNote,updateNote,deleteNote,shareNote} =  require('../controllers/notesController');

router.get('/',getAllNotes);

router.get('/:id',getNotesById);

router.post('/',saveNewNote);

router.put('/:id',updateNote);

router.delete('/:id',deleteNote);

router.post('/:id/share',shareNote);






module.exports = router;