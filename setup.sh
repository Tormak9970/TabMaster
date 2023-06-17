#!/bin/bash

echo "[INFO]: Running Setup..."

if [ -d "./py_backend" ]; then
  if [ ! -L "./py_backend" ]; then
    echo "[INFO]: py_backend is not a symlink!"
    echo ""
    echo "[TASK]: removing py_backend..."
    
    rm -r "./py_backend"

    echo "[INFO]: removed py_backend"
    echo ""
    echo "[TASK]: creating symlink..."

    ln -s ./defaults/py_backend ./py_backend

    echo "[INFO]: py_backend symlink created!"
  else
    echo "[INFO]: py_backend already a symlink!"
  fi
else
  echo "[INFO]: py_backend does not exist!"
  echo ""
  echo "[TASK]: creating symlink..."

  ln -s ./defaults/py_backend ./py_backend

  echo "[INFO]: py_backend symlink created!"
fi

echo "[DONE]"