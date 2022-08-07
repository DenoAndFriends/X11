
#include <cstring>
#include <X11/Xlib.h>
#include <X11/Xatom.h>

#include <iostream>

using std::cout;
using std::endl;


extern "C" {

    Display * connect(){
        return XOpenDisplay(NULL);
    }

    int disconnect(Display * display){
        return XCloseDisplay(display);
    }

    Window rootWindow(Display * display){
        return DefaultRootWindow(display);
    }

    char * windowProperty(
        Display * display ,
        Window window ,
        Atom type ,
        char * name
    ){
        unsigned long bytes;
        unsigned long items;
        unsigned char * value;
        Atom returnType;
        int format;

        Atom property = XInternAtom(display,name,false);

        const int status = XGetWindowProperty(
            display , window , property , 0 , 1024 , False , type , 
            & returnType , & format , & items , & bytes , & value 
        );

        if(status != Success){
            
            cout 
                << "Couldn't query for window property: " 
                << name 
                << endl;
            
            return NULL;
        }
    
        if(returnType != type){
            
            cout 
                << "Requested & returned property types don't match: "
                << type << " : " << returnType 
                << endl;
            
            return NULL;
        }

        return (char *) value;
    }
}
