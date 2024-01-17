import express from "express";

const router=express.Router();

router.get("/", function (req, res) {
    res.json({ msg: "Hola Mundo en Express" })
});

router.get("/nosotros", function (req, res) {
    res.json({ msg: "Nosotros en Express" })
});

export default router;