import * as yup from "yup"
const isString = yup.string();

const usuarioDeleteSchema = yup.object({
        id: isString.typeError("Id tem que ser string")
                .required("Id é obrigatorio."),
  
});

export default usuarioDeleteSchema