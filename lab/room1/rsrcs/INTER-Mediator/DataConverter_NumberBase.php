<?php
/*
 * INTER-Mediator Ver.3.10.1 Released 2013-11-05
 * 
 *   by Masayuki Nii  msyk@msyk.net Copyright (c) 2010 Masayuki Nii, All rights reserved.
 * 
 *   This project started at the end of 2009.
 *   INTER-Mediator is supplied under MIT License.
 */

require_once('INTER-Mediator.php');

class DataConverter_NumberBase
{

    protected $decimalMark = null;
    protected $thSepMark = null;
    protected $currencyMark = null;
    protected $useMbstring;

    function __construct()
    {
        $this->useMbstring = setLocaleAsBrowser(LC_ALL);
        $locInfo = localeconv();
        $this->decimalMark = $locInfo['mon_decimal_point'];
        $this->thSepMark = $locInfo['mon_thousands_sep'];
        $this->currencyMark = $locInfo['currency_symbol'];
    }

    function converterFromUserToDB($str)
    {
        $comp = explode($this->decimalMark, $str);
        $intPart = intval(str_replace($this->thSepMark, '', $comp[0]));
        if (isset($comp[1])) {
            $decimalPart = intval(str_replace($this->thSepMark, '', $comp[1]));
            return floatval(strval($intPart) . '.' . strval($decimalPart));
        } else {
            return $intPart;
        }
    }
}

?>
