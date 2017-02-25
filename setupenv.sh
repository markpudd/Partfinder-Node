#!/bin/bash

while read -r v; do
  export $v	
done < $"env.list"

