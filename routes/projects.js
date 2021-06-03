var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const auth = require('../authentication')


//View for all projects
router.get('/', async function(req, res, next) {
    const loggedUserId = auth.getUser(req)
    if (!loggedUserId) return res.send('Unauthorized')

    const criteria = {}
    if (req.query.owner === 'true') criteria.owner = loggedUserId
    else criteria.members = loggedUserId
    if (req.query.archived === 'true') criteria.archived = true
    else criteria.archived = null

    const data = await mongoose.model('Project').find(criteria)
    res.render('projects', {projects: data, isOwner: criteria.owner || false});
});

//View for project creation
router.get('/create', function(req, res, next) {
    const loggedUserId = auth.getUser(req)
    if (!loggedUserId) return res.send('Unauthorized')
    res.render('create-project', { project: {members: []}, isOwner: true });
});

//Project creation/editing
router.post('/', async function(req, res, next) {
    const loggedUserId = auth.getUser(req)
    if (!loggedUserId) return res.send('Unauthorized')
    delete req.body.owner
    //Input type hidden will store value of project id we want to edit
    if (req.body.id) {
        //Edit mode
        const selectedProject = await mongoose.model('Project').findById(req.body.id)
        Object.assign(selectedProject, req.body)
        await selectedProject.save()
    } else {
        //Creation mode
        await mongoose.model('Project').create({
            ...req.body,
            owner: loggedUserId
        })
    }

    res.redirect('/project?owner=true&archived=false')
});

//View for adding a member to project
router.get('/add-member/:id', async function(req, res, next) {
    const loggedUserId = auth.getUser(req)
    if (!loggedUserId) return res.send('Unauthorized')
    const users = await mongoose.model('User').find()
    res.render('add-member', { project: {id: req.params.id}, users });
});

//Adding member to project
router.post('/add-member', async function(req, res, next) {
    const loggedUserId = auth.getUser(req)
    if (!loggedUserId) return res.send('Unauthorized')
    const selectedProject = await mongoose.model('Project').findById(req.body.id)
    if(selectedProject.members.indexOf(req.body.member)===-1)
        selectedProject.members.push(req.body.member)
    await selectedProject.save()
    res.redirect('/project?owner=true&archived=false');
});

//View for editing project
router.get('/edit/:id', async function(req, res, next) {
    const loggedUserId = auth.getUser(req)
    if (!loggedUserId) return res.send('Unauthorized')

    const projectToEdit = await mongoose.model('Project').findById(req.params.id).populate('members').populate('owner').exec()

    const isOwner = projectToEdit.owner.id === loggedUserId
    res.render('create-project', {project: projectToEdit, isOwner});
});

// Deleting project
router.get('/delete/:id', async function(req, res, next) {
    const loggedUserId = auth.getUser(req)
    if (!loggedUserId) return res.send('Unauthorized')
    await mongoose.model('Project').deleteOne({ _id: req.params.id })
    res.redirect('/project?owner=true&archived=false');
});

// Archiving project
router.get('/archive/:id', async function(req, res, next) {
    const loggedUserId = auth.getUser(req)
    if (!loggedUserId) return res.send('Unauthorized')
    const projectToArchive = await mongoose.model('Project').findById(req.params.id)
    projectToArchive.archived = true
    await projectToArchive.save()
    res.redirect('/project?owner=true&archived=false');
});


module.exports = router;
