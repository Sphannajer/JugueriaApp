import "./styleInput.css"
export function Input({ className = "fm-Formulario-inputsBaner", ...rest }){ 
    return(
        <input className={className} {...rest} /> 
    );
}
