<?php
/*
* INTER-Mediator Ver.@@@@2@@@@ Released @@@@1@@@@
*
*   by Masayuki Nii  msyk@msyk.net Copyright (c) 2013 Masayuki Nii, All rights reserved.
*
*   This project started at the end of 2009.
*   INTER-Mediator is supplied under MIT License.
*/
require_once('../INTER-Mediator/INTER-Mediator.php');

IM_Entry(
    array(
        array(
            'name' => 'pagefile',
            'records' => 1,
            'key' => 'id',
//            'post-enclosure' => 'pageContentGenerated',
        ),
    ),
    array(
        'formatter' => array(),
    ),
    array(
        'db-class' => 'PageEditor',
    ),
    false
);

?>