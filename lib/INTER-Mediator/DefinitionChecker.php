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
 * Date: 2012/10/10
 * Time: 16:19
 * To change this template use File | Settings | File Templates.
 */
class DefinitionChecker
{

    public function checkDefinitions($datasource, $options, $dbspecification)
    {
        if ($dbspecification['db-class'] == 'FileMaker_FX') {
            require_once('DB_FileMaker_FX.php');
        }
        $allMessage = '';
        if ($datasource === NULL) {
            $allMessage .= "*** The Data Sources of the Definition must be specified. ***";
        }
        $this->checkDefinition($datasource, $this->prohibitKeywordsForDataSource);
        if (strlen($this->message) > 0) {
            $allMessage .= "The Data Sources of the Definition: " . $this->message;
        }
        $this->checkDefinition($options, $this->prohibitKeywordsForOption);
        if (strlen($this->message) > 0) {
            $allMessage .= "The Options of the Definition: " . $this->message;
        }
        $this->checkDefinition($dbspecification, $this->prohibitKeywordsForDBSpec);
        if (strlen($this->message) > 0) {
            $allMessage .= "The DB Specification of the Definition: " . $this->message;
        }
        return $allMessage;
    }

    public function checkDefinition($definition, $prohibit)
    {
        if ( $definition === NULL ) {
            return;
        }
        $this->message = '';
        $this->path = array();
        $this->currentProhibit = $prohibit;
        $this->moveChildren($definition);
    }

    private function moveChildren($items)
    {
        $endPoint = $this->currentProhibit;
        $currentPath = '';
        foreach ($this->path as $value) {
            $nextEndPoint = isset($endPoint[$value]) ? $endPoint[$value] : null;
            if ($nextEndPoint === null && is_integer($value)) {
                $nextEndPoint = $endPoint['*'];
            }
            if ($nextEndPoint === null && is_string($value)) {
                $nextEndPoint = $endPoint['#'];
            }
            $endPoint = $nextEndPoint;
            $currentPath .= "[{$value}]";
        }
        if (is_array($endPoint)) {
            if (is_array($items)) {
                foreach ($items as $key => $value) {
                    array_push($this->path, $key);
                    $this->moveChildren($value);
                    array_pop($this->path);
                }
            } else {
                $this->message .= "$currentPath should be define as array. ";
            }
        } else {
            $judge = false;
            if ($endPoint === null) {
                $this->message .= "$currentPath includes an undefined keyword. ";
            } else if ($endPoint === 'string') {
                if (is_string($items)) {
                    $judge = true;
                } else {
                    $this->message .= "$currentPath should be define as string. ";
                }
            } else if ($endPoint === 'scalar') {
                if (is_scalar($items)) {
                    $judge = true;
                } else {
                    $this->message .= "$currentPath should be define as string. ";
                }
            } else if ($endPoint === 'boolean') {
                if (is_bool($items)) {
                    $judge = true;
                } else {
                    $this->message .= "$currentPath should be define as boolean. ";
                }
            } else if ($endPoint === 'integer') {
                if (is_integer($items)) {
                    $judge = true;
                } else {
                    $this->message .= "$currentPath should be define as integer. ";
                }
            } else if ($endPoint === 'array') {
                if (is_array($items)) {
                    $judge = true;
                } else {
                    $this->message .= "$currentPath should be define as array. ";
                }
            } else if (strpos('string', $endPoint) === 0) {
                $openParen = strpos('(', $endPoint);
                $closeParen = strpos(')', $endPoint);
                $possibleString = substr($endPoint, $openParen + 1, $closeParen - $openParen - 1);
                $possibleValues = explode("|", $possibleString);
                if (in_array($items, $possibleValues)) {
                    $judge = true;
                } else {
                    $this->message = "$currentPath should be define as string within [$possibleString]. ";
                }
            }
            if ($judge) {

            }
        }
    }


    private
        $message;
    private
        $path;
    private
        $currentProhibit;
    private
        $prohibitKeywordsForDBSpec = array(
        'db-class' => 'string',
        'dsn' => 'string',
        'option' => 'array',
        'database' => 'string',
        'user' => 'string',
        'password' => 'string',
        'server' => 'string',
        'port' => 'string',
        'protocol' => 'string',
        'datatype' => 'string',
        'external-db' => array( '#' => 'string' ),
    );
    private
        $prohibitKeywordsForOption = array(
        'separator' => 'string',
        'formatter' => array(
            '*' => array('field' => 'string',
                'converter-class' => 'string',
                'parameter' => 'string',
            ),
        ),
        'aliases' => array(
            '#' => 'string',
        ),
        'browser-compatibility' => array(
            '#' => 'string',
        ),
        'transaction' => 'string(none|automatic)',
        'authentication' => array(
            'user' => 'array',
            'group' => 'array',
            'user-table' => 'string',
            'group-table' => 'string',
            'corresponding-table' => 'string',
            'challenge-table' => 'string',
            'authexpired' => 'string',
            'storing' => 'string',
            'realm' => 'string',
            'email-as-username' => 'boolean',
            'issuedhash-dsn' => 'string',
        ),
        'media-root-dir'=> 'string',
        'media-context'=> 'string',
        'smtp' => array(
            'server' => 'string',
            'port' => 'integer',
            'username' => 'string',
            'password' => 'string',
        ),
        'pusher' => array(
            'app_id' => 'string',
            'key' => 'integer',
            'secret' => 'string',
            'channel' => 'string',
        )
    );
    private
        $prohibitKeywordsForDataSource = array(
        '*' => array(
            'name' => 'string',
            'table' => 'string',
            'view' => 'string',
            'records' => 'integer',
            'maxrecords' => 'integer',
            'paging' => 'boolean',
            'key' => 'string',
            'sequence' => 'string',
            'relation' => array(
                '*' => array(
                    'foreign-key' => 'string',
                    'join-field' => 'string',
                    'operator' => 'string',
                    'portal' => 'boolean'
                )
            ),
            'query' => array(
                '*' => array(
                    'field' => 'string',
                    'value' => 'scalar',
                    'operator' => 'string'
                )
            ),
            'sort' => array(
                '*' => array(
                    'field' => 'string',
                    'direction' => 'string'
                )
            ),
            'default-values' => array(
                '*' => array(
                    'field' => 'string',
                    'value' => 'scalar'
                )
            ),
            'repeat-control' => 'string(insert|delete|confirm-insert|confirm-delete)',
            'navi-control' => 'string(master|detail|master-hide|detail-top|detail-bottom)',
            'validation' => array(
                '*' => array(
                    'field' => 'string',
                    'rule' => 'string',
                    'message' => 'string',
                    'notify' => 'string(alert|inline|end-of-sibling)',
                )
            ),
            'post-repeater' => 'string',
            'post-enclosure' => 'string',
            'script' => array(
                '*' => array(
                    'db-operation' => 'string(load|update|new|delete)',
                    'situation' => 'string(pre|presort|post)',
                    'definition' => 'string'
                )
            ),
            'global' => array(
                '*' => array(
                    'db-operation' => 'string(load|update|new|delete)',
                    'field' => 'string',
                    'value' => 'scalar'
                )
            ),
            'authentication' => array(
                'media-handling' => 'boolean',
                'all' => array(
                    'user' => 'array',
                    'group' => 'array',
                    'target' => 'string(table|field-user|field-group)',
                    'field' => 'string'
                ),
                'load' => array(
                    'user' => 'array',
                    'group' => 'array',
                    'target' => 'string(table|field-user|field-group)',
                    'field' => 'string'
                ),
                'update' => array(
                    'user' => 'array',
                    'group' => 'array',
                    'target' => 'string(table|field-user|field-group)',
                    'field' => 'string'
                ),
                'new' => array(
                    'user' => 'array',
                    'group' => 'array',
                    'target' => 'string(table|field-user|field-group)',
                    'field' => 'string'
                ),
                'delete' => array(
                    'user' => 'array',
                    'group' => 'array',
                    'target' => 'string(table|field-user|field-group)',
                    'field' => 'string'
                )
            ),
            'extending-class' => 'string',
            'protect-writing' => 'array',
            'protect-reading' => 'array',
            'db-class' => 'string',
            'dsn' => 'string',
            'option' => 'string',
            'database' => 'string',
            'user' => 'string',
            'password' => 'string',
            'server' => 'string',
            'port' => 'string',
            'protocol' => 'string',
            'datatype' => 'string',
            'cache' => 'boolean',
            'post-reconstruct' => 'boolean',
            'post-dismiss-message' => 'string',
            'post-move-url' => 'string',
            'file-upload' => array(
                '*' => array(
                    'field' => 'string',
                    'context' => 'string',
                )
            ),
            'calculation' => array(
                '*' => array(
                    'field' => 'string',
                    'expression' => 'string',
                )
            ),
            'send-mail' => array(
                'load' => array(
                    'from' => 'string',
                    'to' => 'string',
                    'cc' => 'string',
                    'bcc' => 'string',
                    'subject' => 'string',
                    'body' => 'string',
                    'from-constant' => 'string',
                    'to-constant' => 'string',
                    'cc-constant' => 'string',
                    'bcc-constant' => 'string',
                    'subject-constant' => 'string',
                    'body-constant' => 'string',
                    'body-template' => 'string',
                    'body-fields' => 'string',
                    'f-option' => 'boolean',
                    'body-wrap' => 'integer',
                ),
                'new' => array(
                    'from' => 'string',
                    'to' => 'string',
                    'cc' => 'string',
                    'bcc' => 'string',
                    'subject' => 'string',
                    'body' => 'string',
                    'from-constant' => 'string',
                    'to-constant' => 'string',
                    'cc-constant' => 'string',
                    'bcc-constant' => 'string',
                    'subject-constant' => 'string',
                    'body-constant' => 'string',
                    'body-template' => 'string',
                    'body-fields' => 'string',
                    'f-option' => 'boolean',
                    'body-wrap' => 'integer',
                ),
                'update' => array(
                    'from' => 'string',
                    'to' => 'string',
                    'cc' => 'string',
                    'bcc' => 'string',
                    'subject' => 'string',
                    'body' => 'string',
                    'from-constant' => 'string',
                    'to-constant' => 'string',
                    'cc-constant' => 'string',
                    'bcc-constant' => 'string',
                    'subject-constant' => 'string',
                    'body-constant' => 'string',
                    'body-template' => 'string',
                    'body-fields' => 'string',
                    'f-option' => 'boolean',
                    'body-wrap' => 'integer',
                ),
            )

        ),
    );

}
