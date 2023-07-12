import * as yup from "yup"
const isString = yup.string();

const comentarioIdValidate = yup.object({
    comentarioId: isString.typeError("ComentarioId  precisa ser string").required("ComentarioId é obrigatorio."),
});

export default comentarioIdValidate