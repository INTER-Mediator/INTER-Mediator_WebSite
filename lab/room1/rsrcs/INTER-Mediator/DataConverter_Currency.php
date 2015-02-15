<?php
/*
 * INTER-Mediator Ver.3.10.1 Released 2013-11-05
 * 
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010 Masayuki Nii, All rights reserved.
 * 
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

require_once('DataConverter_NumberBase.php');

class DataConverter_Currency extends DataConverter_NumberBase
{

    private $d = null;

    function __construct($digits = 0)
    {
        parent::__construct();
        $this->d = $digits;
    }

    function converterFromDBtoUser($str)
    {
        return $this->currencyMark . number_format($str, $this->d, $this->decimalMark, $this->thSepMark);
    }

    function converterFromUserToDB($str)
    {
        $normalized = mb_convert_kana($str, 'n');
        $numberString = '';
        $isPeriod = false;
        for ($i = 0; $i < mb_strlen($normalized); $i++) {
            $c = mb_substr($normalized, $i, 1);
            if (($c >= "0" && $c <= "9") || $c = ".") {
                $numberString .= $c;
                if ($c == ".") {
                    $isPeriod = true;
                }
            }
        }
        return $isPeriod ? floatval($numberString) : intval($numberString);
    }

}

?>
