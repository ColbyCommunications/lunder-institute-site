#!/usr/bin/env bash

printf "Installing NPM dependencies for Colby dependencies \n"

shopt -s extglob # Turns on extended globbing

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

<<<<<<< HEAD
# base-install
cd web/wp-content/themes/baseinstall
npm install
gulp
cd -
=======
>>>>>>> e0d8ef033edeeb9982188a0bd61075bd228963c7

printf "Plugins... \n"
NPM_PLUGIN_DIRS=`ls web/wp-content/plugins/colby-*/src/@(index.js)` # Saves it to a variable
for NPMPLUGINDIR in $NPM_PLUGIN_DIRS; do
  NPMPLUGINDIR=`dirname $NPMPLUGINDIR`
  NPMPLUGINDIR_PRUNED=${NPMPLUGINDIR:0:$((${#NPMPLUGINDIR}-3))}
  cd $NPMPLUGINDIR_PRUNED
  printf "Installing NPM dependencies for ${NPMPLUGINDIR_PRUNED}... \n"
  npm install
  printf "Running build for ${NPMPLUGINDIR_PRUNED}... \n"
  npm run build
  cd -
done


printf "Sage Themes... \n"
<<<<<<< HEAD
NPM_THEME_DIRS=`ls web/wp-content/themes/colby-*/resources/assets/scripts/@(main.js)` # Saves it to a variable
=======
NPM_THEME_DIRS=`ls web/wp-content/themes/colby-*/resources/scripts/@(app.js)` # Saves it to a variable
>>>>>>> e0d8ef033edeeb9982188a0bd61075bd228963c7


for NPMTHEMEDIR in $NPM_THEME_DIRS; do
  IFS='/' read -ra THEME_PATH <<< "$NPMTHEMEDIR"
  #NPMTHEMEDIR_PRUNED=${NPMTHEMEDIR:0:$((${#NPMTHEMEDIR}-3))}
  cd "${THEME_PATH[0]}/${THEME_PATH[1]}/${THEME_PATH[2]}/${THEME_PATH[3]}"
  printf "Installing Composer dependencies for ${THEME_PATH[0]}/${THEME_PATH[1]}/${THEME_PATH[2]}/${THEME_PATH[3]}... \n"
  composer install
  composer dump-autoload
  printf "Installing NPM dependencies for ${THEME_PATH[0]}/${THEME_PATH[1]}/${THEME_PATH[2]}/${THEME_PATH[3]}... \n"
  npm install
  printf "Running build for ${THEME_PATH[0]}/${THEME_PATH[1]}/${THEME_PATH[2]}/${THEME_PATH[3]}... \n"
<<<<<<< HEAD
  npm run build:production
=======
  npm run build
>>>>>>> e0d8ef033edeeb9982188a0bd61075bd228963c7
  cd -
done

# npm install
shopt -u extglob