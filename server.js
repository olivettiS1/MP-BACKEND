import express from "express";
import mercadopago from "mercadopago";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔴 TU ACCESS TOKEN (como pediste)
mercadopago.configure({
  access_token: "APP_USR-8720430687315957-040919-2b8830e0b9971cfd11589c388229064a-317126033"
});

app.post("/pagar", async (req, res) => {
  try {

    const { amount, token, payment_method_id, installments, email } = req.body;

    // validación básica
    if (!amount || !token || !payment_method_id || !installments || !email) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const payment = await mercadopago.payment.create({
      transaction_amount: Number(amount),
      token: token,
      description: "Compra tienda",
      installments: Number(installments),
      payment_method_id: payment_method_id,
      payer: {
        email: email
      }
    });

    console.log("✅ PAGO:", payment.body.status);

    res.json(payment.body);

  } catch (error) {
    console.log("❌ ERROR MP:", error.response?.data || error.message);
    res.status(500).json({ error: "Error en pago" });
  }
});

app.listen(3000, () => console.log("🔥 Backend listo en puerto 3000"));