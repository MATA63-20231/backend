import * as yup from "yup"
const isString = yup.string();

const idValidate = yup.object({
    id: isString.typeError("Id precisa ser string")
                    .required("ReceitaId é obrigatorio."),
});

export default idValidate