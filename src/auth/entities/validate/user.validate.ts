import validator from 'validator';
export const userValidation = (body) =>{
    const error:string[]  = [];
    console.log(body)
    if(Object.keys(body).length === 0){
        error.push('Formulario incompleto');
    }else{
        if (!body.name ) {
            error.push('Ingresa un nombre');
        }
        if (!body.lastName ) {
            error.push('Ingresa un apellido');
        }
        if (!body.password ) {
            error.push('Ingresa una contraseña');
        }
        if (!body.email ) {
            error.push('Ingresa un email');
        }
    }
    
    return error;
}
