module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['plugins/**/*.js'],
        dest: 'assets/js/<%= pkg.name %>.js',
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    cssmin: {
      add_banner: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: {
          '<%= pkg.name %>.min.css': ['plugins/**/*.css']
        }
      }
    },
    copy: {
      main: {
        expand: true,
        src: 'plugins/**/*.js',
        dest: 'js/sally/',
        flatten: true,
        filter: 'isFile'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'copy']);

};