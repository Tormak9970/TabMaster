#!/bin/bash

echo "[TASK]: Loading config..."

unclean_output=$(<.vscode/settings.json)
prepped_output="${unclean_output//[\s\{\}\" ]/""}"

IFS=',:' read -r -a tmps <<< $prepped_output

deck_ip="${tmps[1]}"
deck_port="${tmps[3]}"
deck_home_dir="${tmps[5]}/Desktop/dev-plugins/TabMaster"

echo "[INFO]: Loaded config"
echo ""
echo "[TASK]: Deploying plugin to deck..."

function scpDirRecursive() {
  # $1 from dir
  # $2 to dir
  files=($(ls $1))

  if ssh -q deck@$deck_ip "[ -d $2 ]"; then
    for file in "${files[@]}"; do
      if [ -d "$1/$file" ]; then
        scpDirRecursive "$1/$file" "$2/$file"
      else
        diff=$(ssh deck@$deck_ip "cat $2/$file" | diff - $1/$file)

        if [ "$diff" != "" ]; then
          scp -P $deck_port $1/$file deck@$deck_ip:$2/$file
          echo "[INFO]: Copied $1/$file to $2/$file"
        else
          echo "[INFO]: Skipping $1/$file. No changes detected."
        fi
      fi
    done
  else
    scp -r -P $deck_port $1 deck@$deck_ip:$2
    echo "[INFO]: Copied $1 to $2"
  fi
}

#? Copy general files
echo "[TASK]: Copying general files..."
genFiles=(LICENSE main.py package.json plugin.json README.md)

for genFile in "${genFiles[@]}"; do
  diff=$(ssh deck@$deck_ip "cat $deck_home_dir/$genFile" | diff - $genFile)

  if [ "$diff" != "" ]; then
    scp -P $deck_port $genFile deck@$deck_ip:$deck_home_dir/$genFile
    echo "[INFO]: Copied ./$genFile to $deck_home_dir/$genFile"
  else
    echo "[INFO]: Skipping $genFile. No changes detected."
  fi
done

#? Copy frontend
echo "[TASK]: Copying frontend..."
scpDirRecursive "./dist" "$deck_home_dir/dist"

echo "[DONE]"
