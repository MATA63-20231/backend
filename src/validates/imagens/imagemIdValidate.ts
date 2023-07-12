import * as yup from "yup"
const isString = yup.string();

const imagemIdValidate = yup.object({
    imagemId: isString.typeError("Id precisa ser string")
                    .required("ReceitaId é obrigatorio."),
});

export default imagemIdValidate