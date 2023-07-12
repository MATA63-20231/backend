import * as yup from "yup"
const isString = yup.string();

const receitaIdValidate = yup.object({
    receitaId: isString.typeError("ReceitaId precisa ser string")
                    .required("ReceitaId é obrigatorio."),
});

export default receitaIdValidate