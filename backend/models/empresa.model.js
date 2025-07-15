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
    unique: true,
    trim: true
  }
}, {
  timestamps: true
});

const Empresa = mongoose.model('Empresa', empresaSchema);

export default Empresa;
