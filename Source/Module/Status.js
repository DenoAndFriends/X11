

export const Status = {

    Success : 0 ,

    UnknownRequest : 1 ,

    IntegerOutOfRange : 2 ,

    InvalidWindow : 3 ,

    InvalidPixmap : 4 ,

    InvalidAtom : 5 ,

    InvalidCursor : 6 ,

    InvalidFont : 7 ,

    ParameterMismatch : 8 ,

    InvalidDrawable : 9 ,

    InvalidAccess : 10 ,

    InsufficientResources : 11 ,

    UnknownColormap : 12 ,

    InvalidGC : 13 ,

    InvalidId : 14 ,

    UnknownResource : 15 ,

    InvalidRequestSize : 16 ,

    ServerFault : 17 ,

    FirstExtensionError : 128 ,

    LastExtensionError : 255
}


export function statusMessage(status){
    return Object
        .entries(Results)
        .find(([ name , code ]) => code === status)
        ?? `Unknown status code ${ status }`;
}
