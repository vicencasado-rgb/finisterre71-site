#!/bin/bash
cd "$(dirname "$0")"
echo "Iniciando Finisterre 71 en http://localhost:8000 ..."
open "http://localhost:8000/index.html"
python3 -m http.server 8000
