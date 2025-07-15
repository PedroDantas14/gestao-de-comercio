import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    trim: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true
  },
  observacao: {
    type: String,
    trim: true
  },
  data: {
    type: Date,
    default: Date.now
  },
  valorTotal: {
    type: Number,
    default: 0
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

// Índice composto para garantir que número seja único por usuário
pedidoSchema.index({ numero: 1, usuario: 1 }, { unique: true });

const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;
