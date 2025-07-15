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
  }
}, {
  timestamps: true
});

const Produto = mongoose.model('Produto', produtoSchema);

export default Produto;
