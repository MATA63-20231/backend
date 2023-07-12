import * as yup from "yup"
const isString = yup.string();
const isArray = yup.array();
const isObject = yup.object();

const updateReceitaValidate = yup.object({
    receitaId: isString.typeError("ReceitaId precisa ser string")
                    .required("ReceitaId é obrigatorio."),

    titulo: isString.typeError("Título precisa ser string")
                .required("Título é obrigatorio."),
    
    descricao: isString.typeError("Descrição precisa ser string")
                .required("Descrição é obrigatorio."),
    
    tempoPreparo: isObject.typeError("Tempo de preparo precisa ser um objeto.")
                    .required("Tempo de preparo é obrigatorio."),
  
    listaPreparo: isArray.typeError("Lista de preparo precisa ser um array.")
            .required("Lista de preparo é obrigatorio."),
  
    ingredientes: isArray.typeError("Ingrediente precisa ser um array")
            .required("Ingrediente é obrigatorio."),
});

export default updateReceitaValidate