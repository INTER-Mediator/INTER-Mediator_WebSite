<?php
/*
* INTER-Mediator Ver.4.7 Released 2015-01-25
*
*   Copyright (c) 2010-2015 INTER-Mediator Directive Committee, All rights reserved.
*
*   This project started at the end of 2009 by Masayuki Nii  msyk@msyk.net.
*   INTER-Mediator is supplied under MIT License.
*/

class DB_Proxy extends DB_UseSharedObjects implements DB_Proxy_Interface
{
    /**
     * @var null
     */
    public $dbClass = null; // for Default context
    /**
     * @var null
     */
    public $authDbClass = null; // for issuedhash context
    /**
     * @var array
     */
    public $dbClassForContext = array();
    /**
     * @var null
     */
    private $userExpanded = null;
    /**
     * @var string
     */
    private $outputOfProcessing = null;
    /**
     * @var
     */
    private $paramAuthUser;

    /**
     * @var
     */
    private $previousChallenge;
    /**
     * @var
     */
    private $previousClientid;

    private $clientPusherAvailable;

    public static function defaultKey()
    {
        trigger_error("Don't call the static method defaultKey of DB_Proxy class.");
        return null;
    }

    public function getDefaultKey()
    {
        return $this->dbClass->getDefaultKey();
    }

    public function addOutputData($key, $value)
    {
        return $this->outputOfProcessing[$key] = $value;
    }

    public function exportOutputDataAsJSON()
    {
        if (((float)phpversion()) >= 5.3) {
            echo json_encode($this->outputOfProcessing, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
        } else {
            $this->outputOfProcessing = str_replace(
                array('\"', '&', '\'', '<', '>'),
                array('\u0022', '\u0026', '\u0027', '\u003C', '\u003E'),
                json_encode($this->outputOfProcessing)
            );
            echo $this->outputOfProcessing;
        }
    }

    public function exportOutputDataAsJason()
    {
        $this->exportOutputDataAsJSON();
    }

    /**
     * @param bool $testmode
     */
    function __construct($testmode = false)
    {
        if (!$testmode) {
            header('Content-Type: application/json; charset="UTF-8"');
            header('Cache-Control: no-store,no-cache,must-revalidate,post-check=0,pre-check=0');
            header('Expires: 0');
            header('X-XSS-Protection: 1; mode=block');
            header('X-Content-Type-Options: nosniff');
            header('X-Frame-Options: SAMEORIGIN');
        }
    }

    /**
     * @param $dataSourceName
     * @return mixed
     */
    function getFromDB($dataSourceName)
    {
        $currentDataSource = $this->dbSettings->getDataSource($dataSourceName);
        try {
            $className = get_class($this->userExpanded);
            if ($this->userExpanded !== null && method_exists($this->userExpanded, "doBeforeGetFromDB")) {
                $this->logger->setDebugMessage("The method 'doBeforeSetToDB' of the class '{$className}' is calling.", 2);
                $this->userExpanded->doBeforeGetFromDB($dataSourceName);
            }
            if ($this->dbClass !== null) {
                $this->logger->setDebugMessage("The method 'getFromDB' of the class '{$className}' is calling.", 2);
                $tableInfo = $this->dbSettings->getDataSourceTargetArray();
                if (isset($tableInfo['soft-delete'])) {
                    $delFlagField = 'delete';
                    if ($tableInfo['soft-delete'] !== true) {
                        $delFlagField = $tableInfo['soft-delete'];
                    }
                    $this->dbClass->softDeleteActivate($delFlagField, 1);
                    $this->logger->setDebugMessage(
                        "The soft-delete applies to this query with '{$delFlagField}' field.", 2);
                }
                $result = $this->dbClass->getFromDB($dataSourceName);
            }
            if ($this->userExpanded !== null && method_exists($this->userExpanded, "doAfterGetFromDB")) {
                $this->logger->setDebugMessage("The method 'doAfterSetToDB' of the class '{$className}' is calling.", 2);
                $result = $this->userExpanded->doAfterGetFromDB($dataSourceName, $result);
            }
            if ($this->dbSettings->notifyServer && $this->clientPusherAvailable) {
                $this->outputOfProcessing['registeredid'] = $this->dbSettings->notifyServer->register(
                    $this->dbClass->queriedEntity(),
                    $this->dbClass->queriedCondition(),
                    $this->dbClass->queriedPrimaryKeys()
                );
            }
            if (isset($currentDataSource['send-mail']['load'])) {
                $this->logger->setDebugMessage("Try to send an email.", 2);
                $mailSender = new SendMail();
                $mailResult = $mailSender->processing(
                    $currentDataSource['send-mail']['load'],
                    $result,
                    $this->dbSettings->getSmtpConfiguration());
                if ($mailResult !== true) {
                    $this->logger->setErrorMessage("Mail sending error: $mailResult");
                }
            }

        } catch (Exception $e) {
            $this->logger->setErrorMessage("Exception: {$e->getMessage()}");
            return false;
        }
        return $result;
    }

    /**
     * @param $dataSourceName
     * @return mixed
     */
    function countQueryResult($dataSourceName)
    {
        if ($this->userExpanded !== null && method_exists($this->userExpanded, "countQueryResult")) {
            return $result = $this->userExpanded->countQueryResult($dataSourceName);
        }
        if ($this->dbClass !== null) {
            return $result = $this->dbClass->countQueryResult($dataSourceName);
        }
    }

    /**
     * @param $dataSourceName
     * @return mixed
     */
    function setToDB($dataSourceName)
    {
        $currentDataSource = $this->dbSettings->getDataSource($dataSourceName);
        try {
            if ($this->userExpanded !== null && method_exists($this->userExpanded, "doBeforeSetToDB")) {
                $this->userExpanded->doBeforeSetToDB($dataSourceName);
            }
            if ($this->dbClass !== null) {
                if (isset($currentDataSource['send-mail']['edit']) || $this->dbSettings->notifyServer) {
                    $this->dbClass->requireUpdatedRecord(true);
                }
                $result = $this->dbClass->setToDB($dataSourceName);
            }
            if ($this->userExpanded !== null && method_exists($this->userExpanded, "doAfterSetToDB")) {
                $result = $this->userExpanded->doAfterSetToDB($dataSourceName, $result);
            }
            if ($this->dbSettings->notifyServer && $this->clientPusherAvailable) {
                try {
                    $this->dbSettings->notifyServer->updated(
                        $_POST['notifyid'],
                        $this->dbClass->queriedEntity(),
                        $this->dbClass->queriedPrimaryKeys(),
                        $this->dbSettings->getFieldsRequired(),
                        $this->dbSettings->getValue()
                    );
                } catch (Exception $ex) {
                    if ($ex->getMessage() == '_im_no_pusher_exception') {
                        $this->logger->setErrorMessage("The 'Pusher.php' isn't installed on any valid directory.");
                    } else {
                        throw $ex;
                    }
                }
            }
            if (isset($currentDataSource['send-mail']['edit'])) {
                $this->logger->setDebugMessage("Try to send an email.", 2);
                $mailSender = new SendMail();
                $mailResult = $mailSender->processing(
                    $currentDataSource['send-mail']['edit'],
                    $this->dbClass->updatedRecord(),
                    $this->dbSettings->getSmtpConfiguration());
                if ($mailResult !== true) {
                    $this->logger->setErrorMessage("Mail sending error: $mailResult");
                }
            }
        } catch (Exception $e) {
            $this->logger->setErrorMessage("Exception: {$e->getMessage()}");
            return false;
        }
        return $result;
    }

    /**
     * @param $dataSourceName
     * @param $bypassAuth
     * @return mixed
     */
    public function newToDB($dataSourceName, $bypassAuth)
    {
        $currentDataSource = $this->dbSettings->getDataSource($dataSourceName);
        try {
            $className = get_class($this->userExpanded);
            if ($this->userExpanded !== null && method_exists($this->userExpanded, "doBeforeNewToDB")) {
                $this->userExpanded->doBeforeNewToDB($dataSourceName);
            }
            if ($this->dbClass !== null) {
                if (isset($currentDataSource['send-mail']['new']) || $this->dbSettings->notifyServer) {
                    $this->dbClass->requireUpdatedRecord(true);
                }
                $result = $this->dbClass->newToDB($dataSourceName, $bypassAuth);
            }
            if ($this->userExpanded !== null && method_exists($this->userExpanded, "doAfterNewToDB")) {
                $this->logger->setDebugMessage("The method 'newToDB' of the class '{$className}' is calling.", 2);
                $result = $this->userExpanded->doAfterNewToDB($dataSourceName, $result);
            }
            if ($this->dbSettings->notifyServer && $this->clientPusherAvailable) {
                try {
                    $this->dbSettings->notifyServer->created(
                        $_POST['notifyid'],
                        $this->dbClass->queriedEntity(),
                        $this->dbClass->queriedPrimaryKeys(),
                        $this->dbClass->updatedRecord()
                    );
                } catch (Exception $ex) {
                    if ($ex->getMessage() == '_im_no_pusher_exception') {
                        $this->logger->setErrorMessage("The 'Pusher.php' isn't installed on any valid directory.");
                    } else {
                        throw $ex;
                    }
                }
            }
            if (isset($currentDataSource['send-mail']['new'])) {
                $this->logger->setDebugMessage("Try to send an email.");
                $mailSender = new SendMail();
                $mailResult = $mailSender->processing(
                    $currentDataSource['send-mail']['new'],
                    $this->dbClass->updatedRecord(),
                    $this->dbSettings->getSmtpConfiguration());
                if ($mailResult !== true) {
                    $this->logger->setErrorMessage("Mail sending error: $mailResult");
                }
            }
        } catch (Exception $e) {
            $this->logger->setErrorMessage("Exception: {$e->getMessage()}");
            return false;
        }
        return $result;

    }

    /**
     * @param $dataSourceName
     * @return mixed
     */
    function deleteFromDB($dataSourceName)
    {
        try {
            if ($this->userExpanded !== null && method_exists($this->userExpanded, "doBeforeDeleteFromDB")) {
                $this->userExpanded->doBeforeDeleteFromDB($dataSourceName);
            }
            if ($this->dbClass !== null) {
                $tableInfo = $this->dbSettings->getDataSourceTargetArray();
                if (isset($tableInfo['soft-delete'])) {
                    $delFlagField = 'delete';
                    if ($tableInfo['soft-delete'] !== true) {
                        $delFlagField = $tableInfo['soft-delete'];
                    }
                    $this->logger->setDebugMessage(
                        "The soft-delete applies to this delete operation with '{$delFlagField}' field.", 2);
                    $this->dbSettings->addValueWithField($delFlagField, 1);
                    $result = $this->dbClass->setToDB($dataSourceName);
                } else {
                    $result = $this->dbClass->deleteFromDB($dataSourceName);
                }
            }
            if ($this->userExpanded !== null && method_exists($this->userExpanded, "doAfterDeleteFromDB")) {
                $result = $this->userExpanded->doAfterDeleteFromDB($dataSourceName, $result);
            }
            if ($this->dbSettings->notifyServer && $this->clientPusherAvailable) {
                try {
                    $this->dbSettings->notifyServer->deleted(
                        $_POST['notifyid'],
                        $this->dbClass->queriedEntity(),
                        $this->dbClass->queriedPrimaryKeys()
                    );
                } catch (Exception $ex) {
                    if ($ex->getMessage() == '_im_no_pusher_exception') {
                        $this->logger->setErrorMessage("The 'Pusher.php' isn't installed on any valid directory.");
                    } else {
                        throw $ex;
                    }
                }
            }
        } catch (Exception $e) {
            $this->logger->setErrorMessage("Exception: {$e->getMessage()}");
            return false;
        }
        return $result;

    }

    /**
     * @param $dataSourceName
     * @return mixed
     */
    function getFieldInfo($dataSourceName)
    {
        if ($this->dbClass !== null) {
            $result = $this->dbClass->getFieldInfo($dataSourceName);
        }
        return $result;
    }

    public function requireUpdatedRecord($value)
    {
        if ($this->dbClass !== null) {
            $this->dbClass->requireUpdatedRecord($value);
        }
    }

    public function updatedRecord()
    {
        if ($this->dbClass !== null) {
            return $this->dbClass->updatedRecord();
        }
        return null;
    }

    /**
     * @param $datasource
     * @param $options
     * @param $dbspec
     * @param $debug
     * @param null $target
     * @return bool
     */
    function initialize($datasource, $options, $dbspec, $debug, $target = null)
    {
        $this->setUpSharedObjects();

        $currentDir = dirname(__FILE__) . DIRECTORY_SEPARATOR;
        $currentDirParam = $currentDir . 'params.php';
        $parentDirParam = dirname(dirname(__FILE__)) . DIRECTORY_SEPARATOR . 'params.php';
        if (file_exists($parentDirParam)) {
            include($parentDirParam);
        } else if (file_exists($currentDirParam)) {
            include($currentDirParam);
        }

        $this->clientPusherAvailable = (isset($_POST["pusher"]) && $_POST["pusher"] == "yes");
        $this->dbSettings->setDataSource($datasource);

        $this->dbSettings->setSeparator(isset($options['separator']) ? $options['separator'] : '@');
        $this->formatter->setFormatter(isset($options['formatter']) ? $options['formatter'] : null);
        $this->dbSettings->setTargetName(!is_null($target) ? $target : (isset($_POST['name']) ? $_POST['name'] : "_im_auth"));
        $context = $this->dbSettings->getDataSourceTargetArray();

        $dbClassName = 'DB_' .
            (isset($context['db-class']) ? $context['db-class'] :
                (isset($dbspec['db-class']) ? $dbspec['db-class'] :
                    (isset ($dbClass) ? $dbClass : '')));
        $this->dbSettings->setDbSpecServer(
            isset($context['server']) ? $context['server'] :
                (isset($dbspec['server']) ? $dbspec['server'] :
                    (isset ($dbServer) ? $dbServer : '')));
        $this->dbSettings->setDbSpecPort(
            isset($context['port']) ? $context['port'] :
                (isset($dbspec['port']) ? $dbspec['port'] :
                    (isset ($dbPort) ? $dbPort : '')));
        $this->dbSettings->setDbSpecUser(
            isset($context['user']) ? $context['user'] :
                (isset($dbspec['user']) ? $dbspec['user'] :
                    (isset ($dbUser) ? $dbUser : '')));
        $this->dbSettings->setDbSpecPassword(
            isset($context['password']) ? $context['password'] :
                (isset($dbspec['password']) ? $dbspec['password'] :
                    (isset ($dbPassword) ? $dbPassword : '')));
        $this->dbSettings->setDbSpecDataType(
            isset($context['datatype']) ? $context['datatype'] :
                (isset($dbspec['datatype']) ? $dbspec['datatype'] :
                    (isset ($dbDataType) ? $dbDataType : '')));
        $this->dbSettings->setDbSpecDatabase(
            isset($context['database']) ? $context['database'] :
                (isset($dbspec['database']) ? $dbspec['database'] :
                    (isset ($dbDatabase) ? $dbDatabase : '')));
        $this->dbSettings->setDbSpecProtocol(
            isset($context['protocol']) ? $context['protocol'] :
                (isset($dbspec['protocol']) ? $dbspec['protocol'] :
                    (isset ($dbProtocol) ? $dbProtocol : '')));
        $this->dbSettings->setDbSpecOption(
            isset($context['option']) ? $context['option'] :
                (isset($dbspec['option']) ? $dbspec['option'] :
                    (isset ($dbOption) ? $dbOption : '')));
        if (isset($options['authentication']) && isset($options['authentication']['issuedhash-dsn'])) {
            $this->dbSettings->setDbSpecDSN($options['authentication']['issuedhash-dsn']);
        } else {
            $this->dbSettings->setDbSpecDSN(
                isset($context['dsn']) ? $context['dsn'] :
                    (isset($dbspec['dsn']) ? $dbspec['dsn'] :
                        (isset ($dbDSN) ? $dbDSN : '')));
        }

        $pusherParams = null;
        if (isset($pusherParameters)) {
            $pusherParams = $pusherParameters;
        } else if (isset($options['pusher'])) {
            $pusherParams = $options['pusher'];
        }
        if (!is_null($pusherParams)) {
            $this->dbSettings->pusherAppId = $pusherParams['app_id'];
            $this->dbSettings->pusherKey = $pusherParams['key'];
            $this->dbSettings->pusherSecret = $pusherParams['secret'];
            if (isset($pusherParams['channel'])) {
                $this->dbSettings->pusherChannel = $pusherParams['channel'];
            }
        }

        require_once("{$dbClassName}.php");
        $this->dbClass = new $dbClassName();
        if ($this->dbClass == null) {
            $this->logger->setErrorMessage("The database class [{$dbClassName}] that you specify is not valid.");
            echo implode('', $this->logger->getMessagesForJS());
            return false;
        }
        $this->dbClass->setUpSharedObjects($this);
        $this->dbClass->setupConnection();
        if ((!isset($prohibitDebugMode) || !$prohibitDebugMode) && $debug) {
            $this->logger->setDebugMode($debug);
        }
        $this->logger->setDebugMessage("The class '{$dbClassName}' was instanciated.", 2);

        $challengeDSN = null;
        if (isset($options['authentication']) && isset($options['authentication']['issuedhash-dsn'])) {
            $challengeDSN = $options['authentication']['issuedhash-dsn'];
        } else if (isset($issuedHashDSN)) {
            $challengeDSN = $issuedHashDSN;
        }
        if (!is_null($challengeDSN)) {
            require_once("DB_PDO.php");
            $this->authDbClass = new DB_PDO();
            $this->authDbClass->setUpSharedObjects($this);
            $this->authDbClass->setupWithDSN($challengeDSN);
            $this->logger->setDebugMessage(
                "The class 'DB_PDO' was instanciated for issuedhash with {$challengeDSN}.", 2);
        } else {
            $this->authDbClass = $this->dbClass;
        }

        $this->dbSettings->notifyServer = null;
        if ($this->clientPusherAvailable) {
            require_once("NotifyServer.php");
            $this->dbSettings->notifyServer = new NotifyServer();
            if (isset($_POST['notifyid'])
                && $this->dbSettings->notifyServer->initialize($this->authDbClass, $this->dbSettings, $_POST['notifyid'])
            ) {
                $this->logger->setDebugMessage("The NotifyServer was instanciated.", 2);
            }
        }

        $this->dbSettings->setCurrentDataAccess($this->dbClass);

        if (isset($context['extending-class'])) {
            $className = $context['extending-class'];
            $this->userExpanded = new $className();
            if ($this->userExpanded === null) {
                $this->logger->setErrorMessage("The class '{$className}' wasn't instanciated.");
            } else {
                $this->logger->setDebugMessage("The class '{$className}' was instanciated.", 2);
            }
            if (is_subclass_of($this->userExpanded, 'DB_UseSharedObjects')) {
                $this->userExpanded->setUpSharedObjects($this);
            }
        }

        $this->dbSettings->setPrimaryKeyOnly(isset($_POST['pkeyonly']) &&
            !(isset($prohibitIgnoreCondition) ? $prohibitIgnoreCondition : false));

        $this->dbSettings->setCurrentUser(isset($_POST['authuser']) ? $_POST['authuser'] : null);
        $this->dbSettings->setAuthentication(isset($options['authentication']) ? $options['authentication'] : null);

        $this->dbSettings->setStart(isset($_POST['start']) ? $_POST['start'] : 0);
        $this->dbSettings->setRecordCount(isset($_POST['records']) ? $_POST['records'] : 10000000);

        for ($count = 0; $count < 10000; $count++) {
            if (isset($_POST["condition{$count}field"])) {
                $this->dbSettings->addExtraCriteria(
                    $_POST["condition{$count}field"],
                    isset($_POST["condition{$count}operator"]) ? $_POST["condition{$count}operator"] : '=',
                    isset($_POST["condition{$count}value"]) ? $_POST["condition{$count}value"] : null);
            } else {
                break;
            }
        }
        for ($count = 0; $count < 10000; $count++) {
            if (isset($_POST["sortkey{$count}field"])) {
                $this->dbSettings->addExtraSortKey($_POST["sortkey{$count}field"], $_POST["sortkey{$count}direction"]);
            } else {
                break;
            }
        }
        for ($count = 0; $count < 10000; $count++) {
            if (!isset($_POST["foreign{$count}field"])) {
                break;
            }
            $this->dbSettings->addForeignValue(
                $_POST["foreign{$count}field"],
                $_POST["foreign{$count}value"]);
        }

        for ($i = 0; $i < 1000; $i++) {
            if (!isset($_POST["field_{$i}"])) {
                break;
            }
            $this->dbSettings->addTargetField($_POST["field_{$i}"]);
        }
        for ($i = 0; $i < 1000; $i++) {
            if (!isset($_POST["value_{$i}"])) {
                break;
            }
            $this->dbSettings->addValue(get_magic_quotes_gpc() ? stripslashes($_POST["value_{$i}"]) : $_POST["value_{$i}"]);
        }
        if (isset($options['authentication']) && isset($options['authentication']['email-as-username'])) {
            $this->dbSettings->setEmailAsAccount($options['authentication']['email-as-username']);
        } else if (isset($emailAsAliasOfUserName) && $emailAsAliasOfUserName) {
            $this->dbSettings->setEmailAsAccount($emailAsAliasOfUserName);
        }

    }

    /*
    * POST
    * ?access=select
    * &name=<table name>
    * &start=<record number to start>
    * &records=<how many records should it return>
    * &field_<N>=<field name>
    * &value_<N>=<value of the field>
    * &condition<N>field=<Extra criteria's field name>
    * &condition<N>operator=<Extra criteria's operator>
    * &condition<N>value=<Extra criteria's value>
    * &parent_keyval=<value of the foreign key field>
    */

    /**
     * @param $options
     * @param null $access
     * @param bool $bypassAuth
     */
    function processingRequest($options, $access = null, $bypassAuth = false)
    {
        $this->logger->setDebugMessage("[processingRequest]", 2);

        $this->outputOfProcessing = array();
        $generatedPrivateKey = '';
        $passPhrase = '';

        $currentDir = dirname(__FILE__) . DIRECTORY_SEPARATOR;
        $currentDirParam = $currentDir . 'params.php';
        $parentDirParam = dirname(dirname(__FILE__)) . DIRECTORY_SEPARATOR . 'params.php';
        if (file_exists($parentDirParam)) {
            include($parentDirParam);
        } else if (file_exists($currentDirParam)) {
            include($currentDirParam);
        }

        $messageClass = null;
        if (isset($_SERVER["HTTP_ACCEPT_LANGUAGE"])) {
            $clientLangArray = explode(',', $_SERVER["HTTP_ACCEPT_LANGUAGE"]);
            foreach ($clientLangArray as $oneLanguage) {
                $langCountry = explode(';', $oneLanguage);
                if (strlen($langCountry[0]) > 0) {
                    $clientLang = explode('-', $langCountry[0]);
                    $messageClass = "MessageStrings_$clientLang[0]";
                    if (file_exists("{$currentDir}{$messageClass}.php")) {
                        $messageClass = new $messageClass();
                        break;
                    }
                }
                $messageClass = null;
            }
        }
        if ($messageClass == null) {
            $messageClass = new MessageStrings();
        }

        $tableInfo = $this->dbSettings->getDataSourceTargetArray();
        $access = is_null($access) ? $_POST['access'] : $access;
        $clientId = isset($_POST['clientid']) ? $_POST['clientid'] :
            (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : "Non-browser-client");
        $this->paramAuthUser = isset($_POST['authuser']) ? $_POST['authuser'] : "";
        $paramResponse = isset($_POST['response']) ? $_POST['response'] : "";

        if (isset($options['smtp'])) {
            $this->dbSettings->setSmtpConfiguration($options['smtp']);
        }

        $this->dbSettings->setRequireAuthentication(false);
        $this->dbSettings->setRequireAuthorization(false);
        $this->dbSettings->setDBNative(false);
        $keywordAuth = ($access == "select") ? "load" : $access;
        if (isset($options['authentication'])
            || $access == 'challenge' || $access == 'changepassword'
            || (isset($tableInfo['authentication'])
                && (isset($tableInfo['authentication']['all']) || isset($tableInfo['authentication'][$keywordAuth])))
        ) {
            $this->dbSettings->setRequireAuthorization(true);
            $this->dbSettings->setDBNative(false);
            if (isset($options['authentication']['user'])
                && $options['authentication']['user'][0] == 'database_native'
            ) {
                $this->dbSettings->setDBNative(true);
            }
        }

//        $this->logger->setDebugMessage("dbNative={$this->dbSettings->isDBNative()}", 2);
//        $this->logger->setDebugMessage("", 2);

        if (!$bypassAuth && $this->dbSettings->getRequireAuthorization()) { // Authentication required
            if (strlen($this->paramAuthUser) == 0 || strlen($paramResponse) == 0) {
                // No username or password
                $access = "do nothing";
                $this->dbSettings->setRequireAuthentication(true);
            }
            // User and Password are suppried but...
            if ($access != 'challenge') { // Not accessing getting a challenge.
                if ($this->dbSettings->isDBNative()) {
                    $rsa = new Crypt_RSA();
                    $rsa->setPassword($passPhrase);
                    $rsa->loadKey($generatedPrivateKey);
                    $rsa->setPassword();
                    $privatekey = $rsa->getPrivateKey();
                    $priv = $rsa->_parseKey($privatekey, CRYPT_RSA_PRIVATE_FORMAT_PKCS1);
                    require_once('lib/bi2php/biRSA.php');
                    $keyDecrypt = new biRSAKeyPair('0', $priv['privateExponent']->toHex(), $priv['modulus']->toHex());
                    $decrypted = $keyDecrypt->biDecryptedString($paramResponse);

//                    $this->logger->setDebugMessage("decrypted={$decrypted}", 2);

                    if ($decrypted !== false) {
                        $nlPos = strpos($decrypted, "\n");
                        $nlPos = ($nlPos === false) ? strlen($decrypted) : $nlPos;
                        $password = $keyDecrypt->biDecryptedString(substr($decrypted, 0, $nlPos));
                        $password = (strlen($password) == 0) ? "f32b309d4759446fc81de858322ed391a0c167a0" : $password;
                        $challenge = substr($decrypted, $nlPos + 1);

//                        $this->logger->setDebugMessage("password={$password}", 2);
//                        $this->logger->setDebugMessage("paramAuthUser={$this->paramAuthUser}", 2);

                        if (!$this->checkChallenge($challenge, $clientId)) {
                            $access = "do nothing";
                            $this->dbSettings->setRequireAuthentication(true);
                        } else {
                            $this->dbSettings->setUserAndPasswordForAccess($this->paramAuthUser, $password);
                            $this->logger->setDebugMessage("[checkChallenge] returns true.", 2);
                        }
                    } else {
                        $this->logger->setDebugMessage("Can't decrypt.");
                        $access = "do nothing";
                        $this->dbSettings->setRequireAuthentication(true);
                    }
                } else {
                    $noAuthorization = true;
                    $authorizedGroups = $this->dbClass->getAuthorizedGroups($access);
                    $authorizedUsers = $this->dbClass->getAuthorizedUsers($access);

                    $this->logger->setDebugMessage(
                        "authorizedUsers=" . var_export($authorizedUsers, true)
                        . "/authorizedGroups=" . var_export($authorizedGroups, true)
                        , 2);
                    if ((count($authorizedUsers) == 0 && count($authorizedGroups) == 0)) {
                        $noAuthorization = false;
                    } else {
                        $signedUser = $this->dbClass->authSupportUnifyUsernameAndEmail($this->dbSettings->getCurrentUser());
                        if (in_array($signedUser, $authorizedUsers)) {
                            $noAuthorization = false;
                        } else {
                            if (count($authorizedGroups) > 0) {
                                $belongGroups = $this->dbClass->authSupportGetGroupsOfUser($signedUser);
                                $this->logger->setDebugMessage($signedUser . "=belongGroups=" . var_export($belongGroups, true), 2);
                                if (count(array_intersect($belongGroups, $authorizedGroups)) != 0) {
                                    $noAuthorization = false;
                                }
                            }
                        }
                    }
                    if ($noAuthorization) {
                        $this->logger->setDebugMessage("Authorization doesn't meet the settings.");
                        $access = "do nothing";
                        $this->dbSettings->setRequireAuthentication(true);
                    }
                    $signedUser = $this->dbClass->authSupportUnifyUsernameAndEmail($this->paramAuthUser);
                    if (!$this->checkAuthorization($signedUser, $paramResponse, $clientId)) {
                        $this->logger->setDebugMessage(
                            "Authentication doesn't meet valid.{$signedUser}/{$paramResponse}/{$clientId}");
                        // Not Authenticated!
                        $access = "do nothing";
                        $this->dbSettings->setRequireAuthentication(true);
                    }
                }
            }
        }
//        $this->logger->setDebugMessage("requireAuthentication={$this->dbSettings->getRequireAuthentication()}", 2);
//        $this->logger->setDebugMessage("requireAuthorization={$this->dbSettings->getRequireAuthorization()}", 2);
//        $this->logger->setDebugMessage("access={$access}, target={$this->dbSettings->getTargetName()}", 2);
        // Come here access=challenge or authenticated access
        switch ($access) {
            case 'describe':
                $result = $this->dbClass->getSchema($this->dbSettings->getTargetName());
//                $this->outputOfProcessing = 'dbresult=' . arrayToJS($result, '') . ';'
//                    . "resultCount=0;";
                $this->outputOfProcessing['dbresult'] = $result;
                $this->outputOfProcessing['resultCount'] = 0;
                break;
            case 'select':
                $result = $this->getFromDB($this->dbSettings->getTargetName());
                if (isset($tableInfo['protect-reading']) && is_array($tableInfo['protect-reading'])) {
                    $recordCount = count($result);
                    for ($index = 0; $index < $recordCount; $index++) {
                        foreach ($result[$index] as $field => $value) {
                            if (in_array($field, $tableInfo['protect-reading'])) {
                                $result[$index][$field] = "[protected]";
                            }
                        }
                    }
                }
//                $this->outputOfProcessing = 'dbresult=' . arrayToJS($result, '') . ';'
//                    . "resultCount='{$this->countQueryResult($this->dbSettings->getTargetName())}';";
                $this->outputOfProcessing['dbresult'] = $result;
                $this->outputOfProcessing['resultCount'] = $this->countQueryResult($this->dbSettings->getTargetName());
                if (get_class($this->dbClass) == 'DB_FileMaker_FX') {
                    $this->outputOfProcessing['totalCount'] = $this->dbClass->getTotalCount($this->dbSettings->getTargetName());
                }
                break;
            case 'update':
                if (isset($tableInfo['protect-writing']) && is_array($tableInfo['protect-writing'])) {
                    $fieldArray = array();
                    $valueArray = array();
                    $counter = 0;
                    $fieldValues = $this->dbSettings->getValue();
                    foreach ($this->dbSettings->getFieldsRequired() as $field) {
                        if (!in_array($field, $tableInfo['protect-writing'])) {
                            $fieldArray[] = $field;
                            $valueArray[] = $fieldValues[$counter];
                        }
                        $counter++;
                    }
                    $this->dbSettings->setTargetFields($fieldArray);
                    $this->dbSettings->setValue($valueArray);
                }
                $this->setToDB($this->dbSettings->getTargetName());
                break;
            case 'new':
                $result = $this->newToDB($this->dbSettings->getTargetName(), $bypassAuth);
//                $this->outputOfProcessing = "newRecordKeyValue='{$result}';";
                $this->outputOfProcessing['newRecordKeyValue'] = $result;
                $this->outputOfProcessing['dbresult'] = $this->dbClass->updatedRecord();
                break;
            case 'delete':
                $this->deleteFromDB($this->dbSettings->getTargetName());
                break;
            case 'challenge':
                break;
            case 'changepassword':
                if (isset($_POST['newpass'])) {
                    $changeResult = $this->changePassword($this->paramAuthUser, $_POST['newpass']);
//                    $this->outputOfProcessing = "changePasswordResult=" . ($changeResult ? "true;" : "false;");
                    $this->outputOfProcessing['changePasswordResult'] = ($changeResult ? true : false);
                } else {
//                    $this->outputOfProcessing = "changePasswordResult=false;";
                    $this->outputOfProcessing['changePasswordResult'] = false;
                }
                break;
            case 'unregister':
                if (!is_null($this->dbSettings->notifyServer) && $this->clientPusherAvailable) {
                    $tableKeys = null;
                    if (isset($_POST['pks'])) {
                        $tableKeys = json_decode($_POST['pks'], true);
                    }
                    $this->dbSettings->notifyServer->unregister($_POST['notifyid'], $tableKeys);
                }
                break;
        }

//        $this->logger->setDebugMessage("requireAuthentication={$this->dbSettings->getRequireAuthentication()}", 2);
//        $this->logger->setDebugMessage("requireAuthorization={$this->dbSettings->getRequireAuthorization()}", 2);

        if ($this->logger->getDebugLevel() !== false) {
            $fInfo = $this->getFieldInfo($this->dbSettings->getTargetName());
            if ($fInfo != null) {
                foreach ($this->dbSettings->getFieldsRequired() as $fieldName) {
                    if (!$this->dbClass->isContainingFieldName($fieldName, $fInfo)) {
                        $this->logger->setErrorMessage($messageClass->getMessageAs(1033, array($fieldName)));
                    }
                }
            }
        }
    }

    /**
     * @param bool $notFinish
     */
    function finishCommunication($notFinish = false)
    {
        $this->logger->setDebugMessage(
            "[finishCommunication]getRequireAuthorization={$this->dbSettings->getRequireAuthorization()}", 2);

        $this->outputOfProcessing['errorMessages'] = $this->logger->getErrorMessages();
        $this->outputOfProcessing['debugMessages'] = $this->logger->getDebugMessages();
        $this->outputOfProcessing['usenull'] = $this->dbClass->isNullAcceptable();
        $this->outputOfProcessing['notifySupport']
            = is_null($this->dbSettings->notifyServer) ? false : $this->dbSettings->pusherKey;
        if ($notFinish || !$this->dbSettings->getRequireAuthorization()) {
            return;
        }
        $generatedChallenge = $this->generateChallenge();
        $generatedUID = $this->generateClientId('');
        $this->logger->setDebugMessage("generatedChallenge = $generatedChallenge", 2);
        $userSalt = $this->saveChallenge(
            $this->dbSettings->isDBNative() ? 0 : $this->paramAuthUser, $generatedChallenge, $generatedUID);

        $this->previousChallenge = "{$generatedChallenge}{$userSalt}";
        $this->previousClientid = "{$generatedUID}";
//        $this->outputOfProcessing['errorMessages'] = $this->logger->getErrorMessages();
//        $this->outputOfProcessing['debugMessages'] = $this->logger->getDebugMessages();
        $this->outputOfProcessing['challenge'] = "{$generatedChallenge}{$userSalt}";
        $this->outputOfProcessing['clientid'] = $generatedUID;
//        $this->outputOfProcessing['usenull'] = $this->dbClass->isNullAcceptable();
        if ($this->dbSettings->getRequireAuthentication()) {
            $this->outputOfProcessing['requireAuth'] = true;
        }
        $tableInfo = $this->dbSettings->getDataSourceTargetArray();
        if (isset($tableInfo['authentication'])
            && isset($tableInfo['authentication']['media-handling'])
            && $tableInfo['authentication']['media-handling'] === true
        ) {
            $generatedChallenge = $this->generateChallenge();
            $this->saveChallenge($this->paramAuthUser, $generatedChallenge, "_im_media");
            $this->outputOfProcessing['mediatoken'] = $generatedChallenge;
        }
    }

    /* Authentication support */
    /**
     * @param $prefix
     * @return string
     */
    function generateClientId($prefix)
    {
        return sha1(uniqid($prefix, true));
    }

    /**
     * @return string
     */
    function generateChallenge()
    {
        $str = '';
        for ($i = 0; $i < 12; $i++) {
            $n = rand(1, 255);
            $str .= ($n < 16 ? '0' : '') . dechex($n);
        }
        return $str;
    }

    /**
     * @return string
     */
    function generateSalt()
    {
        $str = '';
        for ($i = 0; $i < 4; $i++) {
            $n = rand(33, 126); // They should be an ASCII character for JS SHA1 lib.
            $str .= chr($n);
        }
        return $str;
    }

    function convertHashedPassword($pw)
    {
        $salt = $this->generateSalt();
        return sha1($pw . $salt) . bin2hex($salt);
    }

    /**
     * @param $username
     * @return string
     */
    function authSupportGetSalt($username)
    {
        $hashedpw = $this->dbClass->authSupportRetrieveHashedPassword($username);
        return substr($hashedpw, -8);
    }

    /* returns user's hash salt.

    */
    /**
     * @param $username
     * @param $challenge
     * @param $clientId
     * @return string
     */
    function saveChallenge($username, $challenge, $clientId)
    {
        $this->logger->setDebugMessage("[saveChallenge]user=${username}, challenge={$challenge}, clientid={$clientId}", 2);
        $username = $this->dbClass->authSupportUnifyUsernameAndEmail($username);
        $uid = $this->dbClass->authSupportGetUserIdFromUsername($username);
        $this->authDbClass->authSupportStoreChallenge($uid, $challenge, $clientId);
        return $username === 0 ? "" : $this->authSupportGetSalt($username);
    }

    /**
     * @param $username
     * @param $hashedvalue
     * @param $clientId
     * @return bool
     */
    function checkAuthorization($username, $hashedvalue, $clientId)
    {
        $this->logger->setDebugMessage("[checkAuthorization]user=${username}, paramResponse={$hashedvalue}, clientid={$clientId}", 2);
        $returnValue = false;

        $this->authDbClass->authSupportRemoveOutdatedChallenges();

        $signedUser = $this->dbClass->authSupportUnifyUsernameAndEmail($username);
        $uid = $this->dbClass->authSupportGetUserIdFromUsername($signedUser);
        $storedChalenge = $this->authDbClass->authSupportRetrieveChallenge($uid, $clientId);
        $this->logger->setDebugMessage("[checkAuthorization]storedChalenge={$storedChalenge}", 2);

        if (strlen($storedChalenge) == 24) { // ex.fc0d54312ce33c2fac19d758
            $hashedPassword = $this->dbClass->authSupportRetrieveHashedPassword($username);
            $this->logger->setDebugMessage("[checkAuthorization]hashedPassword={$hashedPassword}", 2);
            $this->logger->setDebugMessage("[checkAuthorization]hmac_value=" . hash_hmac('sha256', $hashedPassword, $storedChalenge), 2);
            if (strlen($hashedPassword) > 0) {
                if ($hashedvalue == hash_hmac('sha256', $hashedPassword, $storedChalenge)) {
//                    if ($hashedvalue == sha1($storedChalenge . $hashedPassword)) {
                    $returnValue = true;
                }
            }
        }
        return $returnValue;
    }

    // This method is just used to authenticate with database user
    /**
     * @param $challenge
     * @param $clientId
     * @return bool
     */
    function checkChallenge($challenge, $clientId)
    {
//        $this->logger->setDebugMessage("[checkChallenge] challenge={$challenge}/".strlen($challenge), 2);
        $returnValue = false;
        $this->authDbClass->authSupportRemoveOutdatedChallenges();
        // Database user mode is user_id=0
        $storedChallenge = $this->authDbClass->authSupportRetrieveChallenge(0, $clientId);
//        $this->logger->setDebugMessage("[checkChallenge] storedChallenge={$storedChallenge}/".strlen($storedChallenge), 2);
        if (strlen($storedChallenge) == 24 && $storedChallenge == $challenge) { // ex.fc0d54312ce33c2fac19d758
            $returnValue = true;
        }
        return $returnValue;
    }

    /**
     * @param $user
     * @param $token
     * @return bool
     */
    function checkMediaToken($user, $token)
    {
        $returnValue = false;
        $this->authDbClass->authSupportRemoveOutdatedChallenges();
        // Database user mode is user_id=0
        $uid = $this->dbClass->authSupportGetUserIdFromUsername($user);
        $storedChallenge = $this->authDbClass->authSupportCheckMediaToken($uid);

        if (strlen($storedChallenge) == 24 && $storedChallenge == $token) { // ex.fc0d54312ce33c2fac19d758
            $returnValue = true;
        }
        return $returnValue;
    }

    /**
     * @param $username
     * @param $password
     * @return mixed
     */
    function addUser($username, $password)
    {
        $salt = $this->generateSalt();
        $hexSalt = bin2hex($salt);
        $returnValue = $this->dbClass->authSupportCreateUser($username, sha1($password . $salt) . $hexSalt);
        return $returnValue;
    }

    /**
     * @param $username
     * @param $newpassword
     * @return mixed
     */
    function changePassword($username, $newpassword)
    {
        $returnValue = $this->dbClass->authSupportChangePassword($username, $newpassword);
        return $returnValue;
    }

    /**
     * @param $email
     * @return array|bool
     */
    function resetPasswordSequenceStart($email)
    {
        if ($email === false || $email == '') {
            return false;
        }
        $userid = $this->dbClass->authSupportGetUserIdFromEmail($email);
        $username = $this->dbClass->authSupportGetUsernameFromUserId($userid);
        if ($username === false || $username == '') {
            return false;
        }
        $clienthost = $this->generateChallenge();
        $hash = sha1($clienthost . $email . $username);
//        var_export($clienthost);
//        var_export($email);
//        var_export($userid);
//        var_export($username);
//        var_export($hash);
        if ($this->authDbClass->authSupportStoreIssuedHashForResetPassword($userid, $clienthost, $hash)) {
            return array('randdata' => $clienthost, 'username' => $username);
        }
        return false;
    }

    /**
     * @param $username
     * @param $email
     * @param $randdata
     * @param $newpassword
     * @return bool
     *
     * Using
     */
    function resetPasswordSequenceReturnBack($username, $email, $randdata, $newpassword)
    {
        if ($email === false || $email == '' || $username === false || $username == '') {
            return false;
        }
        $userid = $this->dbClass->authSupportGetUserIdFromUsername($username);
        $hash = sha1($randdata . $email . $username);
        if ($this->authDbClass->authSupportCheckIssuedHashForResetPassword($userid, $randdata, $hash)) {
            if ($this->changePassword($username, $newpassword)) {
                return true;
            }
        }
        return false;
    }

    function userEnrollmentStart($userID)
    {
        $hash = $this->generateChallenge();
        $this->authDbClass->authSupportUserEnrollmentStart($userID, $hash);
        return $hash;
    }

    function userEnrollmentActivateUser($challenge, $password)
    {
        $userInfo = null;
        $userID = $this->authDbClass->authSupportUserEnrollmentActivateUser($challenge);
        if ($userID !== false) {
            $hashednewpassword = $this->convertHashedPassword($password);
            $userInfo = authSupportUserEnrollmentCheckHash($userID, $hashednewpassword);
        }
        return $userInfo;
    }

    public function setupConnection()
    {
        // TODO: Implement setupConnection() method.
    }

    public function isPossibleOperator($operator)
    {
        // TODO: Implement isPossibleOperator() method.
    }

    public function isPossibleOrderSpecifier($specifier)
    {
        // TODO: Implement isPossibleOrderSpecifier() method.
    }

    public function isContainingFieldName($fname, $fieldnames)
    {
        return null;
    }

    public function isNullAcceptable()
    {
        return true;
    }

    public function softDeleteActivate($field, $value)
    {

    }
}
