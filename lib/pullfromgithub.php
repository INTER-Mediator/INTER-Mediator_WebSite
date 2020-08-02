<?php
$logfile = '/var/www/log/pull-IM_Documents.log';
$clonedDir = dirname(__DIR__);
/* "git -c core.sshCommand=\"ssh -i /var/www/.ssh/gitlab_rsa\" pull origin master"; */
$pullCmd = "git pull origin master";

$body = file_get_contents('php://input');
$body_obj = json_decode($body);
$msg = Date('Y-m-d H:i:s') . "[Request Received]" . var_export($body_obj, true) . "\n";
file_put_contents($logfile, $msg, FILE_APPEND);

chdir($clonedDir);
exec($pullCmd, $output, $rValue);

$response = "OK\r\n";
if ($rValue != 0) {
    $msg = Date('Y-m-d H:i:s') . "[Git-pull Error]\n";
    file_put_contents($logfile, $msg, FILE_APPEND);
    $response = "Error\r\n" . implode("\r\n", $output) . "\r\n";
}

//$msg = implode("\n", $output) . "\n";
//file_put_contents($logfile, $msg, FILE_APPEND);

echo $response;

exit(0);