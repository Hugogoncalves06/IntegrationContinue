#!/bin/bash
echo "run migration bash"
echo ${MYSQL_ROOT_PASSWORD}
mysql -uroot -p${MYSQL_ROOT_PASSWORD} < migrate-v001.sql