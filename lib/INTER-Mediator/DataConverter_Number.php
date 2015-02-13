<?php
/*
* INTER-Mediator Ver.4.7 Released 2015-01-25
*
*   Copyright (c) 2010-2015 INTER-Mediator Directive Committee, All rights reserved.
*
*   This project started at the end of 2009 by Masayuki Nii  msyk@msyk.net.
*   INTER-Mediator is supplied under MIT License.
*/

require_once('DataConverter_NumberBase.php');

class DataConverter_Number extends DataConverter_NumberBase
{

    private $d = null;

    /**
     *
     * @param
     * @return
     */
    function __construct($digits = 0)
    {
        parent::__construct();
        $this->d = $digits;
    }

    function converterFromDBtoUser($str)
    {
        return number_format((double)$str, $this->d, $this->decimalMark, $this->thSepMark);
    }
}

?>
