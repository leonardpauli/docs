#!/usr/bin/env sh
source ./lib.sh

use_p_indentations_logging

p 'my log'; p +1;
	p 'my indented item';
p -1;
p 'back to normal'
