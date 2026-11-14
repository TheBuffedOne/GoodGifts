import express from "express";
const app = express();
app.use(express.json());
app.listen(3001, () => {
    console.log("Server läuft unter http://localhost:3001");
});
const geschenkIdee = [
    { id: 1, gift: "Omas Apfelkuchen", person: "Oma", likes: 0 },
    { id: 2, gift: "Papas Gulasch", person: "Papa", likes: 0 },
    { id: 3, gift: "Kartoffelsuppe", person: "Mama", likes: 0},
    { id: 4, gift: "Pfannkuchen", person: "Lena", likes: 0 },
    { id: 5, gift: "Gemüse-Lasagne", person: "Opa", likes: 0},
];

app.get("/geschenkIdee/", (req, res) => {
    res.json(geschenkIdee);
});