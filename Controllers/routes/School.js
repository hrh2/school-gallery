const express = require('express');
const router = express.Router();
const { School } = require('../../Models/School'); // Adjust path as needed

// CREATE a new school
router.post('/', async (req, res) => {
    try {
        const { name, code, logo, image, video, description } = req.body;

        // Basic manual validation
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ error: 'Valid school name is required' });
        }

        if (!code || typeof code !== 'string' || !code.trim()) {
            return res.status(400).json({ error: 'Valid school code is required' });
        }

        // Optional: you can validate logo, image, video as URLs or filenames
        const school = new School({
            name: name.trim(),
            code: code.trim(),
            logo: logo?.trim(),
            image: image?.trim(),
            video: video?.trim(),
            description: description?.trim()
        });

        await school.save();
        res.status(201).json(school);
    } catch (error) {
        // Check for duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({ error: 'School code already exists' });
        }
        res.status(400).json({ error: error.message });
    }
});


// GET all schools
router.get('/', async (req, res) => {
    try {
        const schools = await School.find();
        res.json(schools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET a school by ID
router.get('/:id', async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
        res.json(school);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE a school by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedSchool = await School.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedSchool) {
            return res.status(404).json({ message: 'School not found' });
        }
        res.json(updatedSchool);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE a school by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedSchool = await School.findByIdAndDelete(req.params.id);
        if (!deletedSchool) {
            return res.status(404).json({ message: 'School not found' });
        }
        res.json({ message: 'School deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// SEARCH schools by name or description
router.get('/search/query', async (req, res) => {
    const { q } = req.query;
    try {
        const results = await School.find({
            $text: { $search: q }
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
