#!/usr/bin/env -S deno run -A --unstable


import { fromFileUrl , dirname , join } from 'https://deno.land/std/path/mod.ts'
import { Status , statusMessage } from '../Source/Module/Status.js'

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

    log('Number of desktops: ',numberOfDesktops());
    // log('Number workspaces: ',windowWorkspaceCount());

    const status = disconnect(connection);

    if(status !== Status.Success)
        throw `Couldn't disconnect properly. ${ statusMessage(status) }`;

    log('Closed Xorg Server');


    function numberOfDesktops(){

        const window = rootWindow(connection);

        const data = windowProperty(connection,window,6,toBytes("_NET_NUMBER_OF_DESKTOPS"));

        return new Deno
            .UnsafePointerView(data)
            .getUint32();
    }

    function windowWorkspaceCount(){

        const window = rootWindow(connection);

        const data = windowProperty(connection,window,6,toBytes("_WIN_WORKSPACE_COUNT"));
        
        return new Deno
            .UnsafePointerView(data)
            .getUint32();
    }
}




foo();
