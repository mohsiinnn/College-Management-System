import React, { forwardRef, useId, useRef } from 'react'

const Ref = () => {
    const username = useRef(null);
    const password = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username.current.value, password.current.value);
    }

    return (<>
        <form onSubmit={handleSubmit}>
            <Reavt label="username" ref={username} />
            <Reavt label="password" ref={password} />
            <button>Submit</button>
        </form>
    </>)
}

export default Ref

// //BEFORE REACT VERSION 19
// const Reavt = forwardRef((props, ref) => {
//     const id = useId(); 
//     return(
//         <div>
//             <label htmlFor={id} >{props.label}</label>
//             <input type="text" ref={ref}/>
//         </div>
//     )
// })


//AFTER REACT VERSION 19
const Reavt = (props) => {
    const id = useId();
    return (
        <div>
            <label htmlFor={id} >{props.label}</label>
            <input type="text" ref={props.ref} />
        </div>
    )
}
// const Reavt = ({label, ref}) => {  // this is for destructuring
//     const id = useId();
//     return(
//         <div>
//             <label htmlFor={id} >{label}</label>
//             <input type="text" ref={ref}/>
//         </div>
//     )
// }