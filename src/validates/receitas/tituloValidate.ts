import * as yup from "yup"
const isString = yup.string();

const tituloValidate = yup.object({
    titulo: isString.typeError("Título precisa ser string")
                .required("Título é obrigatorio."),
});

export default tituloValidate;