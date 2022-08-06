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
    }
}


const library = Deno.dlopen(shared,mapping);

const { connect , disconnect } = library.symbols;


const isNull = (pointer) =>
    pointer.value === 0n;

function foo(){

    log('Starting Xorg Server');
    
    const connection = connect();

    if(isNull(connection))
        throw 'Could not connect to the Xorg server.';

    log('Doing foo');

    const status = disconnect(connection);

    if(status !== Status.Success)
        throw `Couldn't disconnect properly. ${ statusMessage(status) }`;

    log('Closed Xorg Server');
}   


foo();
