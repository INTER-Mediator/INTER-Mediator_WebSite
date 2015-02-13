<?php
/*
* INTER-Mediator Ver.4.7 Released 2015-01-25
*
*   Copyright (c) 2010-2015 INTER-Mediator Directive Committee, All rights reserved.
*
*   This project started at the end of 2009 by Masayuki Nii  msyk@msyk.net.
*   INTER-Mediator is supplied under MIT License.
*/


require_once('INTER-Mediator/INTER-Mediator.php');

class DB_Null extends DB_UseSharedObjects implements DB_Access_Interface
{

    public function getFromDB($dataSourceName)
    {
        return null;
    }

    public function countQueryResult($dataSourceName)
    {
        return 0;
    }

    public function setToDB($dataSourceName)
    {
        return null;
    }

    public function newToDB($dataSourceName, $bypassAuth)
    {
        return null;
    }

    public function deleteFromDB($dataSourceName)
    {
        return null;
    }

    public function getFieldInfo($dataSourceName)
    {
        return null;
    }

    public function setupConnection()
    {
        return null;
    }

    public static function defaultKey()
    {
        return null;
    }

    public function getDefaultKey()
    {
        return null;
    }

    public function isPossibleOperator($operator)
    {
        return null;
    }

    public function isPossibleOrderSpecifier($specifier)
    {
        return null;
    }

    public function requireUpdatedRecord($value)
    {
        return null;
    }

    public function updatedRecord()
    {
        return null;
    }

    public function isContainingFieldName($fname, $fieldnames)
    {
        return null;
    }

    public function isNullAcceptable()
    {
        return null;
    }

    function authSupportStoreChallenge($uid, $challenge, $clientId)
    {
        return null;
    }

    function authSupportRemoveOutdatedChallenges()
    {
        return null;
    }

    function authSupportRetrieveChallenge($uid, $clientId, $isDelete = true)
    {
        return null;
    }

    function authSupportCheckMediaToken($uid)
    {
        return null;
    }

    function authSupportRetrieveHashedPassword($username)
    {
        return null;
    }

    function authSupportCreateUser($username, $hashedpassword)
    {
        return null;
    }

    function authSupportChangePassword($username, $hashednewpassword)
    {
        return null;
    }

    function authSupportCheckMediaPrivilege($tableName, $userField, $user, $keyField, $keyValue)
    {
        return null;
    }

    function authSupportGetUserIdFromEmail($email)
    {
        return null;
    }

    function authSupportGetUserIdFromUsername($username)
    {
        return null;
    }

    function authSupportGetUsernameFromUserId($userid)
    {
        return null;
    }

    function authSupportGetGroupNameFromGroupId($groupid)
    {
        return null;
    }

    function authSupportGetGroupsOfUser($user)
    {
        return null;
    }

    function authSupportUnifyUsernameAndEmail($username)
    {
        return null;
    }

    function authSupportStoreIssuedHashForResetPassword($userid, $clienthost, $hash)
    {
        return null;
    }

    function authSupportCheckIssuedHashForResetPassword($userid, $randdata, $hash)
    {
        return null;
    }

    public function softDeleteActivate($field, $value)
    {
        return null;
    }
}
