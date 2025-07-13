import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true,
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
  }
}, {
  timestamps: true
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;
