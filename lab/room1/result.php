<?php
/**
 * Created by PhpStorm.
 * User: msyk
 * Date: 2013/11/05
 * Time: 1:22
 */
require_once('rsrcs/INTER-Mediator/INTER-Mediator.php');

IM_Entry(
    array(
        array(
            'records' => 60,
            'name' => 'activeuser',
            'view' => 'authuser',
            'table' => 'dummy',
            'query' => array(
                array('field' => 'active', 'operator' => '=', "value"=>1),
            ),
            'sort' => array(
                array('field' => 'username'),
            ),
            'authentication' => array(
                'load' => array( /* load, update, new, delete*/
                    'group' => array('admin'),
                ),
            ),
        ),
        array(
            'records' => 60,
            'name' => 'answer',
            'view' => 'answer',
            'table' => 'dummy',
            'paging' => true,
            'sort' => array(
                array('field' => 'username'),
                array('field' => 'qnum'),
            ),
            'query' => array(
                array('field' => 'qnum', 'operator' => '>=', "value"=>1),
                array('field' => 'qnum', 'operator' => '<=', "value"=>8),
            ),
            'relation' => array(
                array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),
            ),
            'authentication' => array(
                'load' => array( /* load, update, new, delete*/
                    'group' => array('admin'),
                ),
            ),
        ),
        array(
            'records' => 60,
            'name' => 'everyuser',
            'view' => 'authuser',
            'table' => 'dummy',
            'records' => 1,
            'paging' => true,
            'query' => array(
                array('field' => 'active', 'operator' => '>=', "value"=>1),
                array('field' => 'active', 'operator' => '<', "value"=>9),
            ),
            'sort' => array(
                array('field' => 'username'),
            ),
            'authentication' => array(
                'load' => array( /* load, update, new, delete*/
                    'group' => array('admin'),
                ),
            ),
        ),
        array(
            'records' => 10000,
            'name' => 'everyprogress',
            'view' => 'progressdata',
            'table' => 'dummy',
            'sort' => array(
                array('field' => 'finishdt'),
            ),
//            'query' => array(
//                array('field' => 'qnum', 'operator' => '>=', "value"=>1),
//                array('field' => 'qnum', 'operator' => '<=', "value"=>8),
//            ),
            'relation' => array(
                array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),
            ),
            'authentication' => array(
                'load' => array( /* load, update, new, delete*/
                    'group' => array('admin'),
                ),
            ),
        ),
        array(
            'records' => 60,
            'name' => 'survey',
            'view' => 'answer',
            'table' => 'dummy',
            'paging' => true,
            'query' => array(
                array('field' => 'qnum', 'operator' => '=', "value"=>201),
            ),
            'relation' => array(
                array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),
            ),
            'authentication' => array(
                'load' => array( /* load, update, new, delete*/
                    'group' => array('admin'),
                ),
            ),
        ),
        array(
            'records' => 60,
            'name' => 'progress',
            'view' => 'progressdata',
            'table' => 'dummy',
            'paging' => true,
            'sort' => array(
                array('field' => 'finishdt', 'direction'=>"desc"),
            ),
            'authentication' => array(
                'load' => array( /* load, update, new, delete*/
                    'group' => array('admin'),
                ),
            ),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata001',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>1),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata002',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>2),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata003',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>3),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata004',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>4),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata005',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>5),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata006',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>6),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata007',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>7),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata008',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>8),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata009',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>9),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata010',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>10),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata101',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>101),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata102',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>102),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata102',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>102),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata103',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>103),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata104',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>104),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata105',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>105),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata106',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>106),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata107',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>107),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'progressdata108',
            'view' => 'progressdata',
            'table' => 'dummy',
            'query' => array(array('field' => 'page', 'operator' => '=', "value"=>108),),
            'relation' => array(array('foreign-key' => 'username', 'join-field' => 'username', 'operator' => '='),),
            'sort' => array(array('field' => 'finishdt', 'direction'=>"asc"),),
            'authentication' => array('load' => array('group' => array('admin'),),),
        ),
        array(
            'records' => 60,
            'name' => 'answer1',
            'view' => 'answer_use',
            'table' => 'dummy',
            'sort' => array( array('field' => 'username'),),
            'query' => array(
                array('field' => 'qnum', 'operator' => '=', "value"=>1),
                array('field' => 'active', 'operator' => 'IS NOT NULL',),
            ),
            'authentication' => array( 'load' => array(  'group' => array('admin'), ),),
        ),
        array(
            'records' => 60,
            'name' => 'answer2',
            'view' => 'answer_use',
            'table' => 'dummy',
            'sort' => array( array('field' => 'username'),),
            'query' => array(
                array('field' => 'qnum', 'operator' => '=', "value"=>2),
                array('field' => 'active', 'operator' => 'IS NOT NULL',),
            ),
            'authentication' => array( 'load' => array(  'group' => array('admin'), ),),
        ),
        array(
            'records' => 60,
            'name' => 'answer3',
            'view' => 'answer_use',
            'table' => 'dummy',
            'sort' => array( array('field' => 'username'),),
            'query' => array(
                array('field' => 'qnum', 'operator' => '=', "value"=>3),
                array('field' => 'active', 'operator' => 'IS NOT NULL',),
            ),
            'authentication' => array( 'load' => array(  'group' => array('admin'), ),),
        ),
        array(
            'records' => 60,
            'name' => 'answer4',
            'view' => 'answer_use',
            'table' => 'dummy',
            'sort' => array( array('field' => 'username'),),
            'query' => array(
                array('field' => 'qnum', 'operator' => '=', "value"=>4),
                array('field' => 'active', 'operator' => 'IS NOT NULL',),
            ),
            'authentication' => array( 'load' => array(  'group' => array('admin'), ),),
        ),
        array(
            'records' => 60,
            'name' => 'answer5',
            'view' => 'answer_use',
            'table' => 'dummy',
            'sort' => array( array('field' => 'username'),),
            'query' => array(
                array('field' => 'qnum', 'operator' => '=', "value"=>5),
                array('field' => 'active', 'operator' => 'IS NOT NULL',),
            ),
            'authentication' => array( 'load' => array(  'group' => array('admin'), ),),
        ),
        array(
            'records' => 60,
            'name' => 'answer6',
            'view' => 'answer_use',
            'table' => 'dummy',
            'sort' => array( array('field' => 'username'),),
            'query' => array(
                array('field' => 'qnum', 'operator' => '=', "value"=>6),
                array('field' => 'active', 'operator' => 'IS NOT NULL',),
            ),
            'authentication' => array( 'load' => array(  'group' => array('admin'), ),),
        ),
        array(
            'records' => 60,
            'name' => 'answer7',
            'view' => 'answer_use',
            'table' => 'dummy',
            'sort' => array( array('field' => 'username'),),
            'query' => array(
                array('field' => 'qnum', 'operator' => '=', "value"=>7),
                array('field' => 'active', 'operator' => 'IS NOT NULL',),
            ),
            'authentication' => array( 'load' => array(  'group' => array('admin'), ),),
        ),
        array(
            'records' => 60,
            'name' => 'answer8',
            'view' => 'answer_use',
            'table' => 'dummy',
            'sort' => array( array('field' => 'username'),),
            'query' => array(
                array('field' => 'qnum', 'operator' => '=', "value"=>8),
                array('field' => 'active', 'operator' => 'IS NOT NULL',),
            ),
            'authentication' => array( 'load' => array(  'group' => array('admin'), ),),
        ),
        array(
            'records' => 60,
            'name' => 'survey_use',
            'view' => 'answer_use',
            'table' => 'dummy',
            'paging' => true,
            'query' => array(
                array('field' => 'qnum', 'operator' => '=', "value"=>201),
                array('field' => 'active', 'operator' => 'IS NOT NULL',),
            ),
            'authentication' => array(
                'load' => array( /* load, update, new, delete*/
                    'group' => array('admin'),
                ),
            ),
        ),
        array(
            'records' => 60,
            'name' => 'studytimesummary',
            'view' => 'studytimesummary',
            'table' => 'dummy',
            'sort' => array(
                array('field' => 'username'),
            ),
            'authentication' => array(
                'load' => array( /* load, update, new, delete*/
                    'group' => array('admin'),
                ),
            ),
        ),
        array(
            'records' => 60,
            'name' => 'examtimesummary',
            'view' => 'examtimesummary',
            'table' => 'dummy',
            'sort' => array(
                array('field' => 'username'),
            ),
            'authentication' => array(
                'load' => array( /* load, update, new, delete*/
                    'group' => array('admin'),
                ),
            ),
        ),
    ),
    array(
        'formatter' => array(
            array('field'=>'examtimesummary@sum(length)', 'converter-class'=>'Number', 'parameter'=>0),
            array('field'=>'studytimesummary@sum(length)', 'converter-class'=>'Number', 'parameter'=>0),
            array('field'=>'studytimesummary@avg(status)', 'converter-class'=>'Number', 'parameter'=>1),
        ),
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