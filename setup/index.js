#!/usr/bin/env node
'use strict'

const path = require('path')
const fs = require('fs')

const modulesPath = path.resolve(__dirname, '../node_modules')


if (fs.existsSync(modulesPath)) {
  rimraf(modulesPath)
}

fs.mkdirSync(path.resolve(__dirname, '../node_modules'))
fs.mkdirSync(path.resolve(__dirname, '../node_modules/yellow'))
fs.mkdirSync(path.resolve(__dirname, '../node_modules/yellow/bin'))
fs.copyFileSync(
  path.resolve(__dirname, 'stubs/package.json'),
  path.resolve(__dirname, '../node_modules/yellow/package.json')
)
const yellowBinPath = path.resolve(__dirname, '../node_modules/yellow/bin/yellow')
fs.copyFileSync(
  path.resolve(__dirname, 'stubs/yellow'),
  yellowBinPath
)

fs.stat(yellowBinPath, function(error, stats) {
  // open the file (getting a file descriptor to it)
  fs.open(yellowBinPath, "r+", function(error, fd) {
    var buffer = new Buffer(stats.size);

    // read its contents into buffer
    fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
      fs.fchmodSync(
        fd,
        '755'
      )
      fs.mkdirSync(path.resolve(__dirname, '../node_modules/.bin/'))
      fs.symlinkSync(
        path.resolve(__dirname, '../node_modules/yellow/bin/yellow'),
        path.resolve(__dirname, '../node_modules/.bin/yellow')
      )
    });
  });
});

/**
 * Remove directory recursively
 * @param {string} dir_path
 * @see https://stackoverflow.com/a/42505874/3027390
 */
function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry)
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path)
            } else {
                fs.unlinkSync(entry_path)
            }
        })
        fs.rmdirSync(dir_path)
    }
}