import "./styleButton.css"
export function Button({text, type}){
    return (
        <button type={type} className="btn">
            {text}
        </button>
    );
}