import * as yup from "yup"
const isString = yup.string();

const usuarioSchema = yup.object({
    usuario: isString.typeError("Usuário precisa ser string")
                .required("Usuário é obrigatorio."),
  
    nome: isString.typeError("Nome precisa ser string")
                    .required("Nome é obrigatorio."),
  
    email: isString.typeError("E-mail precisa ser string")
            .email("E-mail está incorreto.")
            .required("E-mail é obrigatorio."),
  
    senha: isString.typeError("Senha precisa ser string")
            .required("Senha é obrigatorio."),
  
    confirmacaoSenha: isString.typeError("Confirmaçãode senha precisa ser string")
            .required("Confirmação da senha é obrigatorio."),
});

export default usuarioSchema