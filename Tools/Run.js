#!/usr/bin/env -S deno run -A --unstable


import { fromFileUrl , dirname , join } from 'https://deno.land/std/path/mod.ts'
import { Status , statusMessage } from '../Source/Module/Status.js'
import { Types } from '../Source/Module/Types.js'

const { UnsafePointerView } = Deno;
const { log } = console;

const 
    folder = dirname(fromFileUrl(import.meta.url)) ,
    shared = join(folder,'..','Build','Window.so') ;

    
const mapping = {
    
    connect : {
        parameters : [ 'void' ] ,
        result : 'pointer'
    },

    disconnect : {
        parameters : [ 'pointer' ] ,
        result : 'i16'
    },

    rootWindow : {
        parameters : [ 'pointer' ] ,
        result : 'u64'
    },

    windowProperty : {
        parameters : [ 'pointer' , 'u64' , 'u64' , 'pointer' ] ,
        result : 'pointer'
    }
}


const library = Deno.dlopen(shared,mapping);

const { disconnect , connect , query , windowProperty , rootWindow } = library.symbols;


const isNull = (pointer) =>
    pointer.value === 0n;

const toChars = (string) =>
    [ ... string ];

const toCharCode = (char) =>
    char.charCodeAt();

const toBytes = (string) => 
    Uint8Array.from(toChars(string).map(toCharCode));

function foo(){

    log('Starting Xorg Server');
    
    const connection = connect();

    if(isNull(connection))
        throw 'Could not connect to the Xorg server.';

    log('Doing foo');

    log('Number of desktops: ',desktopCount());
    log('Current desktop: ',currentDesktop());

    const status = disconnect(connection);

    if(status !== Status.Success)
        throw `Couldn't disconnect properly. ${ statusMessage(status) }`;

    log('Closed Xorg Server');


    function desktopCount(){
        return U32Property("_NET_NUMBER_OF_DESKTOPS");
        // return generalProperty("_NET_NUMBER_OF_DESKTOPS",6).getUint32();
    }

    function currentDesktop(){
        return U32Property("_NET_CURRENT_DESKTOP");
        // return generalProperty("_NET_CURRENT_DESKTOP",6).getUint32();
    }

    function generalProperty(name,type){

        const 
            window = rootWindow(connection) ,
            data = windowProperty(connection,window,type,toBytes(name)) ,
            view = new UnsafePointerView(data);

        return view;
    }

    function U32Property(name){
        return generalProperty(name,Types.Cardinal)
            .getUint32();
    }
}




foo();
