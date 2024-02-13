const { src, dest, watch } = require('gulp')
const inject = require('gulp-source-injector')
const fs = require('fs')

/**
 * Copies linked files (js, css) on public subfolders to release subfolders
 * @param {string} path 
 */
async function copyLinkedFile(path) {
	src(path)
		.pipe(dest("release/"))
}

/**
 * Builds all the html files 
 * @param {string} path 
 */
async function buildHtmlFile(path) {
	console.log('Building: ' + path)
	src("public\\*.html")
		.pipe(inject())
		.pipe(dest("release/"))
}

/**
 * 
 * @param {string} path 
 */
function deleteFile(path) {
	try {
		path = 'release\\' + path
		fs.unlinkSync(path)
		console.log('File removed: ' + path)
	  } catch(err) {
		console.log(err)
	  }
}

exports.watch = function() {
	let htmlWatcher = watch('./public/*.html', { ignoreInitial: false, delay: 500 })
	let linkedWatcher = watch('./public/*/**', { ignoreInitial: false, delay: 500 })

	htmlWatcher.on('add', function(path) {
		console.log(`[add] ${path}`)
		buildHtmlFile(path)
	})
	htmlWatcher.on('change', function(path) {
		console.log(`[change] ${path}`)
		buildHtmlFile(path)
	})
	htmlWatcher.on('unlink', function(path) {
		console.log(`[unlink] ${path}`)
		deleteFile(path)
	})
	
	linkedWatcher.on('add', function(path) {
		console.log(`[add] ${path}`)
		copyLinkedFile(path)
	})
	linkedWatcher.on('change', function(path) {
		console.log(`[change] ${path}`)
		copyLinkedFile(path)
	})
	linkedWatcher.on('unlink', function(path) {
		console.log(`[unlink] ${path}`)
		deleteFile(path)
	})
}