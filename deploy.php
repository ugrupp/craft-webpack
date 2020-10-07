<?php
namespace Deployer;

require 'recipe/common.php';

// Project name
set('application', 'craft-webpack');

// Project repository
set('repository', 'git@github.com:ugrupp/craft-webpack.git');

// Shared files/dirs between deploys
set('shared_files', [
    '.env',
    'config/license.key'
]);
set('shared_dirs', [
    'storage',
    'web/cpresources',
    'web/imager',
    'web/photos',
    'web/icons',
    'web/files',
    'web/videos'
]);

// Writable dirs by web server
set('writable_dirs', [
    'storage',
    'storage/backups',
    'storage/composer-backups',
    'storage/config-backups',
    'storage/logs',
    'storage/runtime',
    'config/project',
    'web/cpresources',
    'web/imager',
    'web/photos',
    'web/icons',
    'web/files',
    'web/videos'
]);
set('writable_mode', 'chmod');
set('allow_anonymous_stats', false);

// Only keep 3 releases
set('keep_releases', 3);

// [Optional] Allocate tty for git clone. Default value is false.
set('git_tty', false);


// Set the default deploy environment to staging
set('default_stage', 'staging');

// Hosts
host('staging')
    ->hostname('uberspace')
    ->stage('staging')
    ->set('deploy_path', '/var/www/virtual/ugrupp/craft-webpack');

// Tasks
desc('Execute migrations');
task('craft:migrate', function () {
    run('{{release_path}}/craft migrate/up');
})->once();

task('craft:clear_caches', function () {
    run('{{release_path}}/craft clear-caches/all');
});

task('craft:clear_twigpack_cache', function () {
    run('{{bin/php}} {{release_path}}/craft clear-caches/twigpack-manifest-cache');
});

desc('Build assets locally');
task('build', function () {
    run('npm run build');
})->local();

desc('Upload assets');
task('upload', function () {
    upload(__DIR__ . "/web/dist/", '{{release_path}}/web/dist/');
});

desc('Build and deploy your project');
task('go', [
    'build',
    'deploy'
]);

desc('Deploy your project');
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'upload',
    'deploy:shared',
    'deploy:writable',
    'deploy:vendors',
    'deploy:clear_paths',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
    'success'
]);

after('deploy:symlink', 'craft:clear_twigpack_cache');

// [Optional] Run migrations
// after('deploy:vendors', 'craft:migrate');

// [Optional] If deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');

// Run with '--parallel'
// dep deploy --parallel
