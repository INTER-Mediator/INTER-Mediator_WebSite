<?php
/**
 * Created by PhpStorm.
 * User: msyk
 * Date: 2013/10/16
 * Time: 2:25
 */

/*
 *
 *  '';
 */

require_once('rsrcs/INTER-Mediator/INTER-Mediator.php');

IM_Entry(
    array(
        array(
            'records' => 1,
            'name' => 'loginuser',
            'view' => 'authuser',
            'table' => 'dummy',
            'key' => 'id',
            'authentication' => array(
                'load' => array( /* load, update, new, delete*/
                    'group' => array('admin','examinee'),
                    'target' => 'field-user',
                    'field' => 'username',
                ),
            ),
        ),
        array(
            'records' => 1,
            'name' => 'progress',
            'key' => 'id',
            'authentication' => array(
                'load' => array( /* load, update, new, delete*/
                    'group' => array('admin','examinee'),
                    'target' => 'field-user',
                    'field' => 'username',
                ),
                'new' => array( /* load, update, new, delete*/
                    'group' => array('admin','examinee'),
                    'target' => 'field-user',
                    'field' => 'username',
                ),
                'update' => array('group' => array('dummy')),
                'delete' => array('group' => array('dummy')),
            ),
            'post-dismiss-message' => 'おつかれさまでした。数秒後に次のページに進みます。',
            'post-move-url' => 'routing.html',
        ),
        array(
            'records' => 1,
            'name' => 'question',
            'view' => 'answer',
            'table' => 'answer',
            'key' => 'id',
            'authentication' => array(
                'load' => array( /* load, update, new, delete*/
                    'group' => array('admin','examinee'),
                    'target' => 'field-user',
                    'field' => 'username',
                ),
                'update' => array( /* load, update, new, delete*/
                    'group' => array('admin','examinee'),
                    'target' => 'field-user',
                    'field' => 'username',
                ),
                'delete' => array('group' => array('dummy')),
                'new' => array('group' => array('dummy')),
            ),
        ),
    ),
    array(
        'formatter' => array(),
        'aliases' => array(),
        'authentication' => array( // table only, for all operations
            'authexpired' => '100000', // Set as seconds.
            'storing' => 'cookie-domainwide', // 'cookie'(default), 'cookie-domainwide', 'none'
            'realm' => 'IM Survey', //
        ),
    ),
    array('db-class' => 'PDO'),
    false
);

?>