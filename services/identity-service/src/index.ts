import express from 'express';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => { res.json({ message: 'Microsserviço identity-service rodando!' }); });
app.listen(port, () => { console.log(`Servidor identity-service ouvindo na porta ${port}`); });
