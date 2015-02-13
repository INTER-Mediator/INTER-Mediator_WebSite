<?php
/*
* INTER-Mediator Ver.4.7 Released 2015-01-25
*
*   Copyright (c) 2010-2015 INTER-Mediator Directive Committee, All rights reserved.
*
*   This project started at the end of 2009 by Masayuki Nii  msyk@msyk.net.
*   INTER-Mediator is supplied under MIT License.
*/

class FileUploader
{
    private $db;

    public function finishCommunication()
    {
        $this->db->finishCommunication();
    }

    /*
            array(6) { ["_im_redirect"]=> string(54) "http://localhost/im/Sample_webpage/fileupload_MySQL.html" ["_im_contextname"]=> string(4) "chat" ["_im_field"]=> string(7) "message" ["_im_keyfield"]=> string(2) "id" ["_im_keyvalue"]=> string(2) "38" ["access"]=> string(10) "uploadfile" } array(1) { ["_im_uploadfile"]=> array(5) { ["name"]=> string(16) "ac0600_aoiro.pdf" ["type"]=> string(15) "application/pdf" ["tmp_name"]=> string(26) "/private/var/tmp/phpkk9RXn" ["error"]=> int(0) ["size"]=> int(77732) } }

    */

    public function processing($datasource, $options, $dbspec, $debug)
    {
        $dbProxyInstance = new DB_Proxy();
        $this->db = $dbProxyInstance;
        $dbProxyInstance->initialize($datasource, $options, $dbspec, $debug, $_POST["_im_contextname"]);

        if (!isset($options['media-root-dir'])) {
            if (isset($_POST["_im_redirect"])) {
                header("Location: {$_POST["_im_redirect"]}");
            } else {
                $dbProxyInstance->logger->setErrorMessage("'media-root-dir' isn't specified");
                $dbProxyInstance->processingRequest($options, "noop");
                $dbProxyInstance->finishCommunication();
                $dbProxyInstance->exportOutputDataAsJSON();
            }
            return;
        }
        // requires media-root-dir specification.
        $fileRoot = $options['media-root-dir'];
        if (substr($fileRoot, strlen($fileRoot) - 1, 1) != '/') {
            $fileRoot .= '/';
        }

        if (count($_FILES) < 1) {
            if (isset($_POST["_im_redirect"])) {
                header("Location: {$_POST["_im_redirect"]}");
            } else {
                $dbProxyInstance->logger->setErrorMessage("No file wasn't uploaded.");
                $dbProxyInstance->processingRequest($options, "noop");
                $dbProxyInstance->finishCommunication();
                $dbProxyInstance->exportOutputDataAsJSON();
            }
            return;
        }
        foreach ($_FILES as $fn => $fileInfo) {
        }

        $fileRoot = $options['media-root-dir'];
        if (substr($fileRoot, strlen($fileRoot) - 1, 1) != '/') {
            $fileRoot .= '/';
        }
        $filePathInfo = pathinfo(str_replace('\0', '', basename($fileInfo['name'])));
        $dirPath = str_replace('.', '_', urlencode($_POST["_im_contextname"])) . '/' 
            . str_replace('.', '_', urlencode($_POST["_im_keyfield"])) . "=" 
            . str_replace('.', '_', urlencode($_POST["_im_keyvalue"])) . '/' 
            . str_replace('.', '_', urlencode($_POST["_im_field"]));
        $rand4Digits = rand(1000, 9999);
        $filePartialPath = $dirPath . '/' . $filePathInfo['filename'] . '_'
            . $rand4Digits . '.' . $filePathInfo['extension'];
        $filePath = $fileRoot . $filePartialPath;
        if (strpos($filePath, $fileRoot) !== 0) {
            $dbProxyInstance->logger->setErrorMessage("Invalid Path Error.");
            $dbProxyInstance->processingRequest($options, "noop");
            $dbProxyInstance->finishCommunication();
            $dbProxyInstance->exportOutputDataAsJSON();
            return;
        }
        if (!file_exists($fileRoot . $dirPath)) {
            $result = mkdir($fileRoot . $dirPath, 0744, true);
            if (!$result) {
                $dbProxyInstance->logger->setErrorMessage("Can't make directory. [{$dirPath}]");
                $dbProxyInstance->processingRequest($options, "noop");
                $dbProxyInstance->finishCommunication();
                $dbProxyInstance->exportOutputDataAsJSON();
                return;
            }
        }
        $result = move_uploaded_file($fileInfo['tmp_name'], $filePath);
        if (!$result) {
            if (isset($_POST["_im_redirect"])) {
                header("Location: {$_POST["_im_redirect"]}");
            } else {
                $dbProxyInstance->logger->setErrorMessage("Fail to move the uploaded file in the media folder.");
                $dbProxyInstance->processingRequest($options, "noop");
                $dbProxyInstance->finishCommunication();
                $dbProxyInstance->exportOutputDataAsJSON();
            }
            return;
        }
        
        $targetFieldName = $_POST["_im_field"];
        $dbProxyContext = $dbProxyInstance->dbSettings->getDataSourceTargetArray();
        if (isset($dbProxyContext['file-upload'])) {
            foreach ($dbProxyContext['file-upload'] as $item) {
                if (isset($item['field']) && !isset($item['context'])) {
                    $targetFieldName = $item['field'];
                }
            }
        }

        $dbKeyValue = $_POST["_im_keyvalue"];
        $dbProxyInstance = new DB_Proxy();
        $dbProxyInstance->initialize($datasource, $options, $dbspec, $debug, $_POST["_im_contextname"]);
        $dbProxyInstance->dbSettings->addExtraCriteria($_POST["_im_keyfield"], "=", $dbKeyValue);
        $dbProxyInstance->dbSettings->setTargetFields(array($targetFieldName));
        $dbProxyInstance->dbSettings->setValue(array($filePath));

        $fileContent = file_get_contents($filePath, false, null, 0, 30);
        $headerTop = strpos($fileContent, "data:");
        $endOfHeader = strpos($fileContent, ",");
        if ($headerTop === 0 && $endOfHeader > 0) {
            $tempFilePath = $filePath . ".temp";
            rename($filePath, $tempFilePath);
            $step = 1024;
            if (strpos($fileContent, ";base64") !== false) {
                $fw = fopen($filePath, "w");
                $fp = fopen($tempFilePath, "r");
                fread($fp, $endOfHeader + 1);
                while ($str = fread($fp, $step)) {
                    fwrite($fw, base64_decode($str));
                }
                fclose($fp);
                fclose($fw);
                unlink($tempFilePath);
            }
        }

        $dbProxyInstance->processingRequest($options, "update");

        $relatedContext = null;
        if (isset($dbProxyContext['file-upload'])) {
            foreach ($dbProxyContext['file-upload'] as $item) {
                if ($item['field'] == $_POST["_im_field"]) {
                    $relatedContext = new DB_Proxy();
                    $relatedContext->initialize($datasource, $options, $dbspec, $debug, isset($item['context']) ? $item['context'] : null);
                    $relatedContextInfo = $relatedContext->dbSettings->getDataSourceTargetArray();
                    $fields = array();
                    $values = array();
                    if (isset($relatedContextInfo["query"])) {
                        foreach ($relatedContextInfo["query"] as $cItem) {
                            if ($cItem['operator'] == "=" || $cItem['operator'] == "eq" ) {
                                $fields[] = $cItem['field'];
                                $values[] = $cItem['value'];
                            }
                        }
                    }
                    if (isset($relatedContextInfo["relation"])) {
                        foreach ($relatedContextInfo["relation"] as $cItem) {
                            if ($cItem['operator'] == "=" || $cItem['operator'] == "eq" ) {
                                $fields[] = $cItem['foreign-key'];
                                $values[] = $dbKeyValue;
                            }
                        }
                    }
                    $fields[] = "path";
                    $values[] = $filePartialPath;
                    $relatedContext->dbSettings->setTargetFields($fields);
                    $relatedContext->dbSettings->setValue($values);
                    $relatedContext->processingRequest($options, "new", true);
                //    $relatedContext->finishCommunication(true);
                //    $relatedContext->exportOutputDataAsJSON();
                }
            }
        }

//        echo "dbresult='{$filePath}';";
        $dbProxyInstance->addOutputData('dbresult', $filePath);
        $dbProxyInstance->finishCommunication();
        $dbProxyInstance->exportOutputDataAsJSON();
        if (isset($_POST["_im_redirect"])) {
            header("Location: {$_POST["_im_redirect"]}");
        }
    }

    //
    public function processInfo()
    {
        $onloadScript = "window.onload=function(){setInterval(\"location.reload()\",500);};";
        echo "<html><head><script>{$onloadScript}</script></head><body style='margin:0;padding:0'>";
        echo "<div style='width:160px;border:1px solid #555555;padding:1px;background-color:white;'>";
        $status = apc_fetch('upload_' . $_GET['uploadprocess']);
        if ($status === false) {
            $progress = 0;
        } else {
            $progress = round($status['current'] / $status['total'], 2)*100;
        }
        echo "<div style='width:{$progress}%;height:20px;background-color: #ffb52d;'>";
        echo "<div style='position:absolute;left:0;top:0;padding-left:8px;'>";
        echo $progress  . " %";
        echo "</div></div></div></body></html>";

    }
}
