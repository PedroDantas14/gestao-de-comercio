import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  valor: {
    type: Number,
    required: true,
    min: 0
  },
  descricao: {
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

// Índice composto para garantir que nome seja único por empresa e usuário
produtoSchema.index({ nome: 1, empresa: 1, usuario: 1 }, { unique: true });

const Produto = mongoose.model('Produto', produtoSchema);

export default Produto;
