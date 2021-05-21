var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')


//View for all projects
router.get('/', async function(req, res, next) {
    const data = await mongoose.model('Project').find()
    res.render('projects', {projects: data});
});

//View for project creation
router.get('/create', function(req, res, next) {
    res.render('create-project', { project: {} });
});

//Project creation
router.post('/', async function(req, res, next) {
    //Input type hidden will store value of project id we want to edit
    if (req.body.id) {
        //Edit mode
        const selectedProject = await mongoose.model('Project').findById(req.body.id)
        Object.assign(selectedProject, req.body)
        await selectedProject.save()
    } else {
        //Creation mode
        await mongoose.model('Project').create(req.body)
    }

    res.redirect('/project')
});

//View for adding a member to project
router.get('/add-member/:id', function(req, res, next) {
    res.render('add-member', { project: {id: req.params.id} });
});

//Adding member to project
router.post('/add-member', async function(req, res, next) {
    const selectedProject = await mongoose.model('Project').findById(req.body.id)
    const currentMembers = selectedProject.members || []
    currentMembers.push(req.body.member)
    selectedProject.members = currentMembers
    await selectedProject.save()
    res.redirect('/project');
});

//Editing project
router.get('/edit/:id', async function(req, res, next) {
    const projectToEdit = await mongoose.model('Project').findById(req.params.id)
    res.render('create-project', {project: projectToEdit});
});

// Deleting project
router.get('/delete/:id', async function(req, res, next) {
    await mongoose.model('Project').deleteOne({ _id: req.params.id })
    res.redirect('/project');
});


module.exports = router;
