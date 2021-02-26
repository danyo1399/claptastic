#!/bin/bash
mkdir keys
mkcert -install
mkcert localhost

mv *.pem keys
