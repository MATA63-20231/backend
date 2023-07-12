import * as yup from "yup"
const isBoolean = yup.boolean();

const curtidaValidate = yup.object({
    curtida: isBoolean.typeError("Curtida precisa ser boolean").required("Curtida é obrigatorio."),
});

export default curtidaValidate