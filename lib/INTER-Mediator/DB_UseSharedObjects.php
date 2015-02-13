<?php
/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 *
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2012 Masayuki Nii, All rights reserved.
 *
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */
/**
 * Created by JetBrains PhpStorm.
 * User: msyk
 * Date: 12/05/20
 * Time: 14:24
 * To change this template use File | Settings | File Templates.
 */
abstract class DB_UseSharedObjects
{
    public $dbSettings = null;
    public $logger = null;
    public $formatter = null;
    public $dbClass = null;
    public $proxyObject = null;

    public function setUpSharedObjects( $obj = null )
    {
        if ( $obj === null )    {
            $this->setSettings(new DB_Settings());
            $this->setLogger(new DB_Logger());
            $this->setFormatter(new DB_Formatters());
        } else {
            $this->setSettings($obj->dbSettings);
            $this->setLogger($obj->logger);
            $this->setFormatter($obj->formatter);
            $this->dbClass = $obj->dbClass;
            $this->proxyObject = $obj;
        }
    }

    private function setSettings($dbSettings)
    {
        $this->dbSettings = $dbSettings;
    }

    private function setLogger($logger)
    {
        $this->logger = $logger;
    }

    private function setFormatter($formatter)
    {
        $this->formatter = $formatter;
    }
}

