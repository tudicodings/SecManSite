require("dotenv").config();
console.log("📩 Email:", process.env.EMAIL);
console.log("🔑 Password:", process.env.PASSWORD ? "Set" : "Not Set!");

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const corsOptions = {
    origin: "https://security-management-tst.azurewebsites.net",
    methods: "POST",
    allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
const helmet = require("helmet");
app.use(helmet());

// Ruta pentru trimiterea email-ului de contact
app.post("/send-email", async (req, res) => {
    const { name ,email, services} = req.body;

    console.log("📩 Email request received:", { name, email, services});

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL, // Trebuie să fie același email ca cel din `.env`
        to: process.env.EMAIL, // Primești email-ul tot pe acest cont
        subject: "Mesaj nou de la formularul de contact",
        text: `Nume si Prenume: ${name}\nEmail: ${email}\nServicii dorite: ${services}\n`,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.response);
        res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error("❌ Error sending email:", error);
        res.status(500).json({ success: false, message: "Error sending email" });
    }

});

// 📩 Ruta pentru formularul de ofertă
app.post("/send-oferta", async (req, res) => {
    const { name, telefon, email, companie, locatie, services } = req.body;

    console.log("📩 Offer request received:", { name, telefon, email, companie, locatie, services });

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: "Cerere de ofertă nouă",
        text: `Nume si Prenume: ${name}\nTelefon: ${telefon}\nEmail: ${email}\nCompanie: ${companie}\nLocatie: ${locatie}\nServicii dorite:\n${services}`,
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("✅ Offer Email sent:", info.response);
        res.status(200).json({ success: true, message: "Cerere de ofertă trimisă cu succes!" });
    } catch (error) {
        console.error("❌ Eroare la trimiterea cererii de ofertă:", error);
        res.status(500).json({ success: false, message: "Eroare la trimiterea cererii de ofertă." });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

