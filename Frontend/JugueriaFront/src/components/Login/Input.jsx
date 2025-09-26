import "./styleInput.css"
export function Input({type,name,placeholder}){
    return(
        <input type={type} name={name} placeholder={placeholder} className="fm-Formulario-inputsBaner"/>
        
    );
}