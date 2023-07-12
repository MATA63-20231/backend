import * as yup from "yup"
const isString = yup.string();

const respostaIdValidate = yup.object({
    respostaId: isString.typeError("RespostaId precisa ser string").required("RespostaId é obrigatorio."),
});

export default respostaIdValidate