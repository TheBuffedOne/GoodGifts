import express from 'express';
import {
    ServiceError,
    authenticate,
    listMembers,
    createMember,
    updateMember,
    deleteMember,
    updateProfile,
    changePassword,
    listBirthdayPeople,
    addGift,
    deleteGift,
    toggleGiftLike,
} from './service.js';

const app = express();
app.use(express.json());

// login
app.post('/api/login', (req, res, next) => {
    try {
        res.json(authenticate(req.body.username, req.body.password));
    } catch (error) {
        next(error);
    }
});

app.get('/api/members', (_req, res) => res.json(listMembers()));

app.post('/api/members', (req, res, next) => {
    try {
        res.status(201).json(createMember(req.body));
    } catch (error) {
        next(error);
    }
});


app.patch('/api/members/:id', (req, res, next) => {
    try {
        res.json(updateMember(req.params.id, req.body));
    } catch (error) {
        next(error);
    }
});

// del member
app.delete('/api/members/:id', (req, res, next) => {
    try {
        deleteMember(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

// save provile
app.patch('/api/members/:id/profile', (req, res, next) => {
    try {
        res.json(updateProfile(req.params.id, req.body));
    } catch (error) {
        next(error);
    }
});

// change password
app.patch('/api/members/:id/password', (req, res, next) => {
    try {
        res.json(changePassword(req.params.id, req.body));
    } catch (error) {
        next(error);
    }
});

app.get('/geschenkIdee/', (req, res) => res.json(listBirthdayPeople(req.query.userId)));

app.post('/geschenkIdee/:personId/presents', (req, res, next) => {
    try {
        res.status(201).json(addGift(req.params.personId, req.body.userId, req.body.name));
    } catch (error) {
        next(error);
    }
});

app.delete('/geschenkIdee/:personId/presents/:giftId', (req, res, next) => {
    try {
        deleteGift(req.params.personId, req.params.giftId, req.query.userId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

app.post('/geschenkIdee/:personId/presents/:giftId/like', (req, res, next) => {
    try {
        res.json(toggleGiftLike(req.params.personId, req.params.giftId, req.body.userId));
    } catch (error) {
        next(error);
    }
});

app.use((error, _req, res, next) => {
    if (error instanceof ServiceError) return res.status(error.status).json({error: error.message});
    return next(error);
});

app.listen(3001, () => {
    console.log('Server läuft unter http://localhost:3001');
});
