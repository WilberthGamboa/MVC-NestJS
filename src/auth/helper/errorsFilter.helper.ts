import { Injectable } from "@nestjs/common";
import { AuthFormErros } from "../interfaces/AuthFormErros.interfaces"
@Injectable()
export class ErrorsFilter {
    private authFormErros:AuthFormErros 

    constructor (){
        this.authFormErros = {
            email: [],
            everyone:[],
            password:[]
        }
    }

    public register(errorMessages: string | string[]): AuthFormErros {
        

        if (Array.isArray(errorMessages)) {
            errorMessages.forEach(errorMessage => {
                if (errorMessage.includes('contraseña')) {
                    this.authFormErros.password.push(errorMessage)
                } 
                else if (errorMessage.includes('correo')){
                    this.authFormErros.email.push(errorMessage)
                }
                else {
                    this.authFormErros.everyone.push(errorMessage)
                }
            });
        } else {
            if (errorMessages.includes('contraseña')) {
                this.authFormErros.password.push(errorMessages)
            } 
            else if (errorMessages.includes('correo')){
                this.authFormErros.email.push(errorMessages)
            }
            else {
                this.authFormErros.everyone.push(errorMessages)
            }
        }

        return this.authFormErros;

    }


    public login(errorMessages: string|string[], body:any):AuthFormErros{

        if (errorMessages==='Unauthorized'){
            errorMessages=''
            
            if (body.username==='') {
              this.authFormErros.email.push('El correo no puede estar vacio')
            }
            else if(body.password===''){
                this.authFormErros.password.push('La contraseña no puede estar vacia')
            }
           
            
        }
        return this.authFormErros;

    }
}
