import mongoose from 'mongoose';

const pedidoProdutoSchema = new mongoose.Schema({
  pedido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pedido',
    required: true
  },
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: true
  },
  quantidade: {
    type: Number,
    required: true,
    min: 1
  },
  valorUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

// Índice composto para evitar duplicatas de produto no mesmo pedido
pedidoProdutoSchema.index({ pedido: 1, produto: 1 }, { unique: true });

const PedidoProduto = mongoose.model('PedidoProduto', pedidoProdutoSchema);

export default PedidoProduto;
