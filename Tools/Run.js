#!/usr/bin/env -S deno run -A --unstable


import { fromFileUrl , dirname , join } from 'https://deno.land/std/path/mod.ts'

const { log } = console;

const 
    folder = dirname(fromFileUrl(import.meta.url)) ,
    shared = join(folder,'..','Build','Window.so') ;

    
const mapping = {
    foo : {
        parameters : [ 'void' ] ,
        result : 'i16'
    }
}


const library = Deno.dlopen(shared,mapping);


const status = library.symbols.foo();

log('Status',status);

    