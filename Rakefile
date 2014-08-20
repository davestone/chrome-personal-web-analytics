
desc 'Build packages for distribution'
task :default do
  RakeFileUtils.verbose_flag = false

  # new build
  rm_rf 'dist'
  mkdir 'dist'
  rm_rf 'build'
  cp_r 'src', 'build'
  cp 'README.md', 'build'

  # clean up
  cd 'build' do
    rm_f '.DS_Store'
  end

  # dist
  sh 'zip -mr dist/extension.zip build/'
end
