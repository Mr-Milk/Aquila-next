import {useState} from "react";


export const useLazyBool = (initValue) => {

    const [v, setV] = useState(initValue);

    const lazySet = (cv) => {
        if (!(v === cv)) {
            setV(cv);
        }
    }

    return [v, lazySet]
}