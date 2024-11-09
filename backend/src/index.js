import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import { initializeDatabase } from './database/init.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Aumentar el límite de tamaño del payload
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// Rutas
app.use('/api/auth', authRoutes);

// Inicializar base de datos
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Error al inicializar la base de datos:', err);
  process.exit(1);
});