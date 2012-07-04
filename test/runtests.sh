#!/bin/bash
../bin/cantest test1.js --no-browse || exit 1             # we expect test1 to pass
(../bin/cantest test2.js --no-browse && exit 1) || exit 0 # we expect test2 to fail

