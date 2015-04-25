<?php
/**
 * Created by PhpStorm.
 * User: msyk
 * Date: 15/04/24
 * Time: 23:42
 */
require_once('INTER-Mediator/INTER-Mediator.php');

IM_Entry(
    array(
        array(
            'name' => 'survey',
            'key' => 'id',
            'post-reconstruct' => true,
            'post-dismiss-message' => 'ありがとうございました',
            'validation' => array(
                array(
                    'field' => 'name',
                    'rule' => "value != ''",
                    'message' => '何か入力してください',
                    'notify' => 'inline'
                ),
            ),
        ),
        array(
            'name' => 'surveylist',
            'view' => 'survey',
            'table' => 'survey',
            'key' => 'id',
            'records' => 10,
            'maxrecords' => 10,
            'paging' => true,
            'repeat-control' => 'confirm-delete',
            'query' => array(
                //      array('field' => 'Q2', 'operator'=>'>', 'value' => '43')
            )
        ),
    ),
    null,
    array('db-class' => 'PDO'),
    2
);