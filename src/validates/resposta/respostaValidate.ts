import * as yup from "yup"
const isString = yup.string();

const respostaValidate = yup.object({
    resposta: isString.typeError("Resposta precisa ser string").required("Resposta é obrigatorio."),
});

export default respostaValidate