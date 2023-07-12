import * as yup from "yup"
const isString = yup.string();

const authenticateSchema = yup.object({
        usuario: isString.typeError("Usuário precisa ser string")
        .required("Usuário é obrigatorio."),

        senha: isString.typeError("Senha precisa ser string")
            .required("Senha é obrigatorio."),


});

export default authenticateSchema