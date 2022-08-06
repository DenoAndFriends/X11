#!/bin/env sh

clear

folder="$(dirname -- "$(readlink -fn -- "$0"; echo x)")/.."
source="$folder/Source/Native"
build="$folder/Build"

echo "\nSetup\n"

rm -r "$build"
mkdir "$build"

echo "\nC++ -> Object\n"

g++                      \
    -I/usr/include/X11   \
    -o "$build/Window.o" \
    -fmodules-ts         \
    -std=c++20           \
    -fPIC                \
    -c                   \
    "$source/mod.cpp"

echo "\nObject -> Shared Library\n"

g++                       \
    "$build/Window.o"     \
    -o "$build/Window.so" \
    -shared               \
    -W                    \
    -lX11
