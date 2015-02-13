<?php
/*
 * INTER-Mediator Ver.4.6 Released 2014-12-30
 * 
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010 Masayuki Nii, All rights reserved.
 * 
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

class DataConverter_AppendSuffix
{

    private $appendStr;

    function __construct($str = '')
    {
        $this->appendStr = $str;
    }

    function converterFromDBtoUser($str)
    {
        return $str . $this->appendStr;
    }

    function converterFromUserToDB($str)
    {
        if (strrpos($str, $this->appendStr) === (strlen($str) - strlen($this->appendStr))) {
            return substr($str, 0, strlen($str) - strlen($this->appendStr));
        }
        return $str;
    }
}

?>
