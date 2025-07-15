import mongoose from 'mongoose';

const empresaSchema = new mongoose.Schema({
  nomeFantasia: {
    type: String,
    required: true,
    trim: true
  },
  razaoSocial: {
    type: String,
    required: true,
    trim: true
  },
  cnpj: {
    type: String,
    required: true,
    trim: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, {
  timestamps: true
});

// Índice composto para garantir que CNPJ seja único por usuário
empresaSchema.index({ cnpj: 1, usuario: 1 }, { unique: true });

const Empresa = mongoose.model('Empresa', empresaSchema);

export default Empresa;
