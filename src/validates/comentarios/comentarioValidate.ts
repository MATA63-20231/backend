import * as yup from "yup"
const isString = yup.string();

const comentarioValidate = yup.object({
    comentario: isString.typeError("Comentario precisa ser string").required("Comentario é obrigatorio."),  
});

export default comentarioValidate