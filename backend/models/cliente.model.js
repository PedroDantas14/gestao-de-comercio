import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  telefone: {
    type: String,
    required: true,
    trim: true
  },
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

// Índice composto para garantir que email seja único por usuário
clienteSchema.index({ email: 1, usuario: 1 }, { unique: true });

const Cliente = mongoose.model('Cliente', clienteSchema);

export default Cliente;
