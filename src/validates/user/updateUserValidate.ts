import * as yup from "yup"
const isString = yup.string();

const usuarioUpdateSchema = yup.object({
        usuario: isString.typeError("Usuário precisa ser string")
                .required("Usuário é obrigatorio."),
  
        senhaAtual: isString.typeError("Senha Atual precisa ser string")
                    .required("Senha Atual é obrigatorio."),

        novaSenha: isString.typeError("Nova Senha precisa ser string")
            .required("Nova Senha é obrigatorio."),
  
        confirmacaoSenha: isString.typeError("Senha precisa ser string")
            .required("Senha é obrigatorio."),
});

export default usuarioUpdateSchema