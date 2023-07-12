import * as yup from "yup"
const isString = yup.string();
const isArray = yup.array();
const isNumeroPositivo = yup.number().positive();

const createReceitaSchema = yup.object({
    
    titulo: isString.typeError("Título precisa ser string")
                .required("Título é obrigatorio."),
    
    descricao: isString.typeError("Descrição precisa ser string")
                .required("Descrição é obrigatorio."),
    
    rendimento: isNumeroPositivo.typeError("Rendimento precisa ser um numero positivo.")
                .required("Rendimento é obrigatorio."),
        
    tempoPreparo: isArray.typeError("Tempo de preparo precisa ser um array.")
                    .required("Tempo de preparo é obrigatorio."),
  
    listaPreparo: isArray.typeError("Lista de preparo precisa ser um array.")
            .required("Lista de preparo é obrigatorio."),
  
    ingredientes: isArray.typeError("Ingrediente precisa ser um array")
            .required("Ingrediente é obrigatorio."),
  
});

export default createReceitaSchema;