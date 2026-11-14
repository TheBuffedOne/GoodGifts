import { people } from '../src/FixData/people.js';

let nextGiftId = 1;
people.forEach((person) => {
    person.presents = (person.presents ?? []).map((gift) => ({
        id: nextGiftId++,
        gift: gift.gift,
        likedBy: [],
        addedBy: null,
    }));
});

export class ServiceError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export function findUser(id) {
    return people.find((person) => person.id === Number(id));
}

export function publicUser(user) {
    const safeUser = { ...user };
    delete safeUser.password;
    delete safeUser.presents;
    safeUser.username ??= user.name.toLowerCase().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9. ]/g, '').trim().replace(/\s+/g, '.');
    return safeUser;
}

function toClientGift(gift, userId) {
    return {
        id: gift.id,
        name: gift.gift,
        likes: gift.likedBy.length,
        liked: gift.likedBy.includes(userId),
        canDelete: gift.addedBy === userId || Boolean(findUser(userId)?.isAdmin),
    };
}

export function authenticate(username, password) {
    const value = String(username ?? '').trim().toLowerCase();
    const user = people.find((person) => (
        person.name.toLowerCase() === value || person.username?.toLowerCase() === value
    ) && person.password === password);
    if (!user) throw new ServiceError(401, 'Name oder Passwort ist falsch.');
    return publicUser(user);
}

export function listMembers() {
    return people.map(publicUser);
}

export function createMember({ name, username, email, password } = {}) {
    if (![name, username, email, password].every((value) => typeof value === 'string' && value.trim())) {
        throw new ServiceError(400, 'Alle Felder sind erforderlich.');
    }
    const normalizedUsername = username.trim().toLowerCase();
    if (people.some((person) => publicUser(person).username.toLowerCase() === normalizedUsername)) {
        throw new ServiceError(409, 'Dieser Benutzername wird bereits verwendet.');
    }
    if (people.some((person) => person.name.toLowerCase() === name.trim().toLowerCase())) {
        throw new ServiceError(409, 'Dieser Name wird bereits verwendet.');
    }
    const user = {
        id: Math.max(0, ...people.map((person) => person.id)) + 1,
        name: name.trim(), username: username.trim(), email: email.trim(),
        birthday: '', avatar: 47, password: password.trim(), presents: [],
    };
    people.push(user);
    return publicUser(user);
}

export function updateMember(id, { name, username, birthday } = {}) {
    const user = findUser(id);
    if (!user) throw new ServiceError(404, 'Mitglied nicht gefunden.');
    if (username && people.some((person) => person.id !== user.id
        && publicUser(person).username.toLowerCase() === username.trim().toLowerCase())) {
        throw new ServiceError(409, 'Dieser Benutzername wird bereits verwendet.');
    }
    if (typeof name === 'string') user.name = name.trim();
    if (typeof username === 'string') user.username = username.trim();
    if (typeof birthday === 'string') user.birthday = birthday.trim();
    return publicUser(user);
}

export function deleteMember(id) {
    const index = people.findIndex((person) => person.id === Number(id));
    if (index < 0) throw new ServiceError(404, 'Mitglied nicht gefunden.');
    if (people[index].isAdmin) throw new ServiceError(400, 'Der Admin kann nicht entfernt werden.');
    people.splice(index, 1);
}

export function updateProfile(id, { displayName, birthday, avatar, noGos, notes } = {}) {
    const user = findUser(id);
    if (!user) throw new ServiceError(404, 'Mitglied nicht gefunden.');
    if (typeof displayName === 'string' && displayName.trim()) user.name = displayName.trim();
    if (typeof birthday === 'string') user.birthday = birthday.trim();
    if (typeof avatar === 'string') user.profileAvatar = avatar;
    if (Array.isArray(noGos)) user.noGos = noGos;
    if (typeof notes === 'string') user.notes = notes;
    return publicUser(user);
}

export function changePassword(id, { currentPassword, newPassword } = {}) {
    const user = findUser(id);
    if (!user) throw new ServiceError(404, 'Mitglied nicht gefunden.');
    if (user.password !== currentPassword) throw new ServiceError(400, 'Das aktuelle Passwort ist falsch.');
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
        throw new ServiceError(400, 'Das neue Passwort muss mindestens 8 Zeichen lang sein.');
    }
    user.password = newPassword;
    return { ok: true };
}

export function listBirthdayPeople(userId) {
    return people.map((person) => ({
        ...publicUser(person),
        presents: (person.presents ?? []).map((gift) => toClientGift(gift, Number(userId))),
    }));
}

export function addGift(personId, userId, name) {
    const user = findUser(userId);
    if (!user) throw new ServiceError(401, 'Unbekannter User');
    const giftName = String(name ?? '').trim();
    if (!giftName) throw new ServiceError(400, 'Name fehlt');
    if (giftName.length > 80) throw new ServiceError(400, 'Name zu lang (max. 80 Zeichen)');
    const person = findUser(personId);
    if (!person) throw new ServiceError(404, 'Person nicht gefunden');
    const gift = { id: nextGiftId++, gift: giftName, likedBy: [], addedBy: user.id };
    person.presents.push(gift);
    return toClientGift(gift, user.id);
}

export function deleteGift(personId, giftId, userId) {
    const user = findUser(userId);
    if (!user) throw new ServiceError(401, 'Unbekannter User');
    const person = findUser(personId);
    if (!person) throw new ServiceError(404, 'Person nicht gefunden');
    const index = person.presents.findIndex((gift) => gift.id === Number(giftId));
    if (index < 0) throw new ServiceError(404, 'Geschenk nicht gefunden');
    const gift = person.presents[index];
    if (gift.addedBy !== user.id && !user.isAdmin) {
        throw new ServiceError(403, 'Nur der Ersteller oder Admin darf löschen');
    }
    person.presents.splice(index, 1);
}

export function toggleGiftLike(personId, giftId, userId) {
    const user = findUser(userId);
    if (!user) throw new ServiceError(401, 'Unbekannter User');
    const person = findUser(personId);
    if (!person) throw new ServiceError(404, 'Person nicht gefunden');
    const gift = person.presents.find((item) => item.id === Number(giftId));
    if (!gift) throw new ServiceError(404, 'Geschenk nicht gefunden');
    const index = gift.likedBy.indexOf(user.id);
    if (index < 0) gift.likedBy.push(user.id);
    else gift.likedBy.splice(index, 1);
    return { liked: index < 0, likes: gift.likedBy.length };
}
